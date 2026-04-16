"""
app/services/query_service.py
----------------------------------
Reusable VisaMate Query Engine
Shared between:
 - /query endpoint (structured API)
 - /chat endpoint (LLM-style conversation)
"""

from app.services.retriever import retrieve_relevant_docs
from app.services.generation import generate_primary_answer
from app.services.verification import run_verification_pipeline, SourceChunk


def query_visa_facts(query: str, visa_stage: str = "UNKNOWN"):
    """
    Reusable query pipeline for both /query and /chat.
    """
    # --- Step 1️⃣ Retrieve relevant documents ---
    docs = retrieve_relevant_docs(query, k=3, metadata_filter={"visa_stage": visa_stage})
    context = "\n\n".join([d.get("content", "") for d in docs]) if docs else ""

    # --- Step 2️⃣ Generate GPT-4o primary answer ---
    primary_answer = generate_primary_answer(query, context)

    # --- Step 3️⃣ Convert docs → SourceChunk list ---
    sources = [
        SourceChunk(
            doc_id=str(i + 1),
            filename=d.get("source", f"doc_{i+1}.pdf"),
            snippet=d.get("content", "")[:300],
            score=float(d.get("score", 0.8) or 0.8),
            url=d.get("url", ""),
        )
        for i, d in enumerate(docs or [])
    ]

    # --- Step 4️⃣ Run verification ---
    result = run_verification_pipeline(query, context, primary_answer, sources)

    result["visa_stage_used"] = visa_stage
    result["retrieved_docs"] = docs
    return result
