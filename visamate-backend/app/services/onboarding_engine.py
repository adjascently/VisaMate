"""
Onboarding Engine (Full Version)
-------------------------------
Handles the full, multi-branch onboarding process:
• F-1 Student
• F-1 on CPT
• F-1 on OPT
• F-1 on STEM OPT
• H-1B Worker
• Prospective Student
"""

from datetime import datetime, timezone


# --------------------------------------------------------
# FIRST GREETING
# --------------------------------------------------------
def start_onboarding():
    """Initial greeting for a brand-new user."""
    return [
        "👋 Hello, and welcome to **VisaMate** — your professional immigration compliance advisor.",
        "I'll help you stay compliant throughout your U.S. visa journey — from **F-1** to **H-1B**.",
        "Before we get started, I need to collect a few details. This should take **2–3 minutes**.",
        "Let’s begin — could you tell me your **current immigration status**?\n\n"
        "**Options:**\n"
        "- F-1 Student (currently enrolled)\n"
        "- F-1 Student on CPT\n"
        "- F-1 Student on OPT\n"
        "- F-1 Student on STEM OPT\n"
        "- H-1B Employee\n"
        "- Prospective Student\n"
        "- Other / Transitioning"
    ]


# --------------------------------------------------------
# MASTER ONBOARDING ROUTER
# --------------------------------------------------------
def run_onboarding_step(user_id, user_message, profile):
    """
    Handles each onboarding stage depending on profile['onboarding_stage'].
    Returns: (messages: list[str], updated_profile: dict)
    """

    msg = user_message.strip()
    stage = profile.get("onboarding_stage", "collect_status")

    # Normalize status labels
    def normalize_status(text: str) -> str:
        t = text.lower().replace(" ", "")
        if "stem" in t:
            return "STEM-OPT"
        if "opt" in t and "stem" not in t:
            return "OPT"
        if "cpt" in t:
            return "CPT"
        if "h1" in t or "h-1" in t:
            return "H-1B"
        if "prospective" in t or "admitted" in t:
            return "Prospective Student"
        if "f1" in t or "f-1" in t:
            return "F-1"
        return None

    # ============================================================
    # 1️⃣ COLLECT STATUS
    # ============================================================
    if stage == "collect_status":
        detected = normalize_status(msg)
        if not detected:
            return ([
                "Thanks — could you clarify which status applies?\n"
                "F-1, CPT, OPT, STEM OPT, H-1B, or Prospective Student?"
            ], profile)

        profile["status"] = detected

        # Redirect to the branch
        if detected == "F-1":
            profile["onboarding_stage"] = "f1_university"
            return ([
                "Great — you're an **F-1 student** currently enrolled.",
                "To set up your compliance profile, I need a few details.",
                "📍 Which **university** are you attending?"
            ], profile)

        if detected == "CPT":
            profile["onboarding_stage"] = "cpt_start_end"
            return ([
                "Got it — you're currently on **CPT**.",
                "Let’s begin with your dates.",
                "📅 What are your **CPT start and end dates** (as listed on your I-20)?"
            ], profile)

        if detected == "OPT":
            profile["onboarding_stage"] = "opt_employer"
            return ([
                "You're on **OPT** — great.",
                "I need to confirm a few details about your employment.",
                "🏢 Who is your **current employer**?"
            ], profile)

        if detected == "STEM-OPT":
            profile["onboarding_stage"] = "stem_employer"
            return ([
                "You're on **STEM OPT**. I’ll help track your evaluations and reporting deadlines.",
                "🏢 Who is your **current employer**?"
            ], profile)

        if detected == "H-1B":
            profile["onboarding_stage"] = "h1b_employer"
            return ([
                "You're on **H-1B** — understood.",
                "Let’s verify your petition details.",
                "🏢 Who is your **sponsoring employer**?"
            ], profile)

        if detected == "Prospective Student":
            profile["onboarding_stage"] = "prospective_start"
            return ([
                "Exciting — you're a **prospective F-1 student**!",
                "📅 What is your **program start date** on your I-20?"
            ], profile)

    # ============================================================
    # 2️⃣ F-1 STUDENT BRANCH
    # ============================================================
    if stage == "f1_university":
        profile["university"] = msg
        profile["onboarding_stage"] = "f1_program"
        return (["📘 What is your **program of study**?"], profile)

    if stage == "f1_program":
        profile["program"] = msg
        profile["onboarding_stage"] = "f1_grad"
        return (["📅 What is your **expected graduation date** (as listed on your I-20)?"], profile)

    if stage == "f1_grad":
        profile["grad_date"] = msg
        profile["onboarding_stage"] = "f1_prior_cpt"
        return (["Have you previously done **CPT or OPT**, or will this be your first time?"], profile)

    if stage == "f1_prior_cpt":
        profile["prior_experience"] = msg
        profile["onboarding_stage"] = "f1_i20_upload"
        return ([
            "Thank you.",
            "To verify your SEVIS details, please upload your **latest Form I-20**.",
            "You can also upload your **passport visa page** (optional)."
        ], profile)

    if stage == "f1_i20_upload":
        profile["onboarding_stage"] = "completed"
        profile["onboarding_complete"] = True
        profile["last_interaction"] = datetime.now(timezone.utc)
        return ([
            "Perfect — once you upload your I-20, I’ll extract your SEVIS ID, program end date, "
            "and travel signature validity.",
            "🎉 Your onboarding is complete!"
        ], profile)

    # ============================================================
    # 3️⃣ CPT BRANCH
    # ============================================================
    if stage == "cpt_start_end":
        profile["cpt_dates"] = msg
        profile["onboarding_stage"] = "cpt_employer"
        return (["🏢 What is your **CPT employer name**?"], profile)

    if stage == "cpt_employer":
        profile["employer"] = msg
        profile["onboarding_stage"] = "cpt_type"
        return (["Is your CPT **full-time**, **part-time**, or **contractual**?"], profile)

    if stage == "cpt_type":
        profile["employment_type"] = msg
        profile["onboarding_stage"] = "cpt_i20_upload"
        return ([
            "Almost done — please upload your **CPT-authorized I-20**.",
            "You may also upload your **offer letter** (optional)."
        ], profile)

    if stage == "cpt_i20_upload":
        profile["onboarding_stage"] = "completed"
        profile["onboarding_complete"] = True
        return ([
            "Great — once you upload your I-20, I will confirm employer name, start/end dates, "
            "and ensure your authorization is valid.",
            "🎉 Your onboarding is complete!"
        ], profile)

    # ============================================================
    # 4️⃣ OPT BRANCH
    # ============================================================
    if stage == "opt_employer":
        profile["employer"] = msg
        profile["onboarding_stage"] = "opt_type"
        return (["Is your job **full-time** or **part-time**?"], profile)

    if stage == "opt_type":
        profile["employment_type"] = msg
        profile["onboarding_stage"] = "opt_i20_ead_upload"
        return ([
            "Please upload:\n"
            "• Your **EAD card** (front + back)\n"
            "• Your **OPT I-20**\n"
            "• Your employment letter (optional)"
        ], profile)

    if stage == "opt_i20_ead_upload":
        profile["onboarding_stage"] = "completed"
        profile["onboarding_complete"] = True
        return ([
            "Perfect — I'll extract your EAD validity and employer details.",
            "🎉 Your onboarding is complete!"
        ], profile)

    # ============================================================
    # 5️⃣ STEM-OPT BRANCH
    # ============================================================
    if stage == "stem_employer":
        profile["employer"] = msg
        profile["onboarding_stage"] = "stem_role"
        return (["Have there been any changes in your **role, salary, or supervisor**?"], profile)

    if stage == "stem_role":
        profile["recent_changes"] = msg
        profile["onboarding_stage"] = "stem_docs"
        return ([
            "Please upload:\n"
            "• Your **STEM EAD card**\n"
            "• Your **STEM OPT I-20**\n"
            "• Your **Form I-983**\n"
            "• (Optional) Pay stub or verification letter"
        ], profile)

    if stage == "stem_docs":
        profile["onboarding_stage"] = "completed"
        profile["onboarding_complete"] = True
        return ([
            "Thank you — I'll track your next evaluation due date.",
            "🎉 Your onboarding is complete!"
        ], profile)

    # ============================================================
    # 6️⃣ H-1B BRANCH
    # ============================================================
    if stage == "h1b_employer":
        profile["employer"] = msg
        profile["onboarding_stage"] = "h1b_dates"
        return (["📅 What are your **H-1B validity dates** (from your I-797)?"], profile)

    if stage == "h1b_dates":
        profile["h1b_dates"] = msg
        profile["onboarding_stage"] = "h1b_docs"
        return ([
            "Please upload:\n"
            "• Your **Form I-797 Approval Notice**\n"
            "• Your **I-94**\n"
            "• Passport visa page\n"
            "• (Optional) Pay stub or offer letter"
        ], profile)

    if stage == "h1b_docs":
        profile["onboarding_stage"] = "completed"
        profile["onboarding_complete"] = True
        return ([
            "Great — I’ll track your renewal window and petition details.",
            "🎉 Your onboarding is complete!"
        ], profile)

    # ============================================================
    # 7️⃣ PROSPECTIVE STUDENT
    # ============================================================
    if stage == "prospective_start":
        profile["program_start"] = msg
        profile["onboarding_stage"] = "prospective_prep"
        return ([
            "Nice! Would you like help reviewing your **pre-arrival checklist**?\n"
            "SEVIS fee, visa appointment, travel documents, etc."
        ], profile)

    if stage == "prospective_prep":
        profile["onboarding_stage"] = "prospective_docs"
        return ([
            "Please upload:\n"
            "• Your **I-20**\n"
            "• Passport biographical page\n"
            "• Visa appointment confirmation (if available)"
        ], profile)

    if stage == "prospective_docs":
        profile["onboarding_stage"] = "completed"
        profile["onboarding_complete"] = True
        return ([
            "Everything looks good — I’ll help you prepare for travel and arrival.",
            "🎉 Your onboarding is complete!"
        ], profile)

    # --------------------------------------------------------
    # DEFAULT FALLBACK
    # --------------------------------------------------------
    return (["Got it — tell me more."], profile)
