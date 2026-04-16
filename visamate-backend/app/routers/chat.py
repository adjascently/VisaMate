"""
Unified Conversational Endpoint
-------------------------------
Single /chat route that handles:
• Persona-based onboarding
• Status updates (F-1, CPT, OPT, STEM-OPT, H-1B, etc.)
• Document upload prompts
• General visa-related questions via RAG
• Memory continuity between sessions
"""

from datetime import datetime
from fastapi import APIRouter, Form

from app.services.intent_detection import detect_intent
from app.services.dialog_policy import next_for_status
from app.services.query_service import query_visa_facts
from app.models.user import get_user_profile, update_profile
from app.services.session_memory import append_message, get_full_history
from app.services.onboarding_engine import start_onboarding, run_onboarding_step


router = APIRouter(prefix="/chat", tags=["Conversation"])


@router.post("/", summary="Chat with VisaMate")
def chat(user_id: str = Form(...), message: str = Form("")):
    now = datetime.utcnow()
    profile = get_user_profile(user_id) or {}

    # Always ensure user has a history list
    if "history" not in profile:
        profile["history"] = []

    onboarding_stage = profile.get("onboarding_stage")
    onboarding_complete = profile.get("onboarding_complete", False)

    # =====================================================================
    # 1️⃣ NEW USER GREETING (only when onboarding has NOT started/completed)
    # =====================================================================
    if message.strip() == "" and not profile.get("first_greeting_done"):
        msgs = start_onboarding()
        profile.update({
            "first_greeting_done": True,
            "onboarding_stage": "collect_status",
            "last_interaction": now
        })
        update_profile(user_id, profile)

        for m in msgs:
            append_message(user_id, "assistant", m)

        return {
            "messages": [{"role": "assistant", "content": m} for m in msgs],
            "stage": "onboarding",
        }

    # =====================================================================
    # 2️⃣ RETURNING USER CHECK-IN (only when onboarding *is* complete)
    # =====================================================================
    if message.strip() == "" and onboarding_complete:
        status = (profile.get("status") or "Unknown").upper()
        stage_data = profile.get("stage_data", {})

        if status == "CPT":
            content = (
                f"Welcome back! I still have you on CPT with "
                f"{stage_data.get('employer', 'your employer')}. "
                "Any changes? Would you like an OPT planning checklist?"
            )
        elif status == "OPT":
            content = "Welcome back! I can check your next SEVIS 90-day reporting deadline or verify your EAD details."
        elif status == "STEM-OPT":
            content = "Welcome back! Would you like to confirm your 12- or 24-month I-983 evaluation timelines?"
        elif status == "H-1B":
            content = "Welcome back! I can review your petition validity or set up renewal reminders."
        elif status == "F-1":
            content = "Welcome back! Want me to verify your latest I-20 and travel signature validity?"
        else:
            content = "Welcome back! What would you like to review today?"

        append_message(user_id, "assistant", content)
        update_profile(user_id, {"last_interaction": now})

        return {
            "messages": [{"role": "assistant", "content": content}],
            "stage": "chatting",
        }

    # =====================================================================
    # 3️⃣ CONTINUE ONBOARDING FLOW (if onboarding not complete)
    # =====================================================================
    if not onboarding_complete and onboarding_stage:
        msgs, updated_profile = run_onboarding_step(user_id, message, profile)
        update_profile(user_id, updated_profile)

        return {
            "messages": [{"role": "assistant", "content": m} for m in msgs],
            "stage": updated_profile.get("onboarding_stage"),
        }

    # =====================================================================
    # 4️⃣ NORMAL CHAT MODE — INTENT + RAG ANSWERS
    # =====================================================================
    intent, payload = detect_intent(message)

    # ---- A) User updates/declares visa status ----
    if intent in {"declare_status", "update_stage"} and payload:
        update_profile(user_id, {"status": payload, "last_interaction": now})
        msgs = next_for_status(payload)
        if not msgs:
            msgs = [f"Status set to {payload}. What would you like to do next?"]

        for m in msgs:
            append_message(user_id, "assistant", m)

        return {
            "messages": [{"role": "assistant", "content": m} for m in msgs],
            "stage": payload.lower(),
        }

    # ---- B) User intends to upload a document ----
    if intent == "doc_upload_intent":
        status = profile.get("status", "F-1")
        msgs = next_for_status(status)

        upload_msgs = [
            m for m in msgs
            if any(x in m.lower() for x in ["upload", "pdf", "image", "attach"])
        ]

        if not upload_msgs:
            upload_msgs = [
                "Please upload the document (PDF/Image). I’ll extract key fields automatically."
            ]

        for m in upload_msgs:
            append_message(user_id, "assistant", m)

        return {
            "messages": [{"role": "assistant", "content": m} for m in upload_msgs],
            "stage": "awaiting_upload",
        }

    # ---- C) Smalltalk ----
    if intent == "smalltalk":
        resp = (
            "Understood. What would you like to do next? "
            "I can verify documents, check timelines, or explain visa rules."
        )
        append_message(user_id, "assistant", resp)
        return {"messages": [{"role": "assistant", "content": resp}], "stage": "chatting"}

    # =====================================================================
    # 5️⃣ RAG-BASED KNOWLEDGE ANSWERING
    # =====================================================================
    history_tail = [m["content"] for m in get_full_history(user_id)[-10:]]
    history_ctx = "\n".join(history_tail)
    current_stage = profile.get("status", "Unknown")

    persona_prefix = (
        f"You are VisaMate, a professional U.S. immigration compliance advisor. "
        f"The user is currently on {current_stage}. "
        "Be precise, supportive, structured, and DO NOT reintroduce yourself."
    )

    contextual_query = (
        f"{persona_prefix}\n\nConversation history:\n{history_ctx}\n\nUser: {message}"
    )

    ai = query_visa_facts(contextual_query, current_stage)

    answer = ai.get("answer", "Here’s what I found.")
    trust = ai.get("trust_score")
    sources = ai.get("retrieved_docs", [])

    answer += "\n\nWould you like me to check what documents or reminders come next?"

    if trust:
        answer += f"\n\n📊 **Confidence:** {round(float(trust) * 100, 1)}%"

    if sources:
        cites = []
        for s in sources[:2]:
            title = s.get("source", "USCIS Policy")
            url = s.get("url", "")
            cites.append(f"[{title}]({url})" if url else title)
        if cites:
            answer += "\n\n📚 **Based on:** " + ", ".join(cites)

    append_message(user_id, "assistant", answer)
    update_profile(user_id, {"last_interaction": now})

    return {"messages": [{"role": "assistant", "content": answer}], "stage": "chatting"}
