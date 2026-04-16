from datetime import datetime
from app.models.user import User
from app.db import users_collection
from pymongo import MongoClient
import os


# -------------------------------------------------------------
# 🧠 MongoDB Connection (long-term conversational memory)
# -------------------------------------------------------------
client = MongoClient(os.getenv("MONGODB_URI"))
db = client["visamate"]
profiles = db["user_profiles"]


# -------------------------------------------------------------
# 📂 Profile Memory Helpers
# -------------------------------------------------------------
def get_profile(user_id: str):
    """Retrieve an existing user profile from memory DB."""
    return profiles.find_one({"user_id": user_id})


def create_profile(user_id: str, name: str = None):
    """Create a new conversational memory profile."""
    doc = {
        "user_id": user_id,
        "name": name or "",
        "status": None,          # e.g. "F-1", "CPT", "OPT"
        "stage_data": {},        # employer, end dates, etc.
        "last_interaction": datetime.utcnow(),
        "created_at": datetime.utcnow(),
    }
    profiles.insert_one(doc)
    return doc


def update_profile(user_id: str, updates: dict):
    """Update existing profile fields."""
    profiles.update_one({"user_id": user_id}, {"$set": updates})


# -------------------------------------------------------------
# 🧩 Visa Stage Detection Logic
# -------------------------------------------------------------
def detect_stage(parsed_fields: dict) -> str:
    """Infer visa stage from OCR-extracted fields."""
    employer = (parsed_fields.get("Employer_Name") or "").upper()
    sevis_id = parsed_fields.get("SEVIS_ID")
    cpt_start = parsed_fields.get("CPT_Start_Date")
    cpt_end = parsed_fields.get("CPT_End_Date")
    program_end = (parsed_fields.get("Program_End_Date") or "").strip()
    category = (parsed_fields.get("Category") or "").upper()

    # STEM-OPT
    if "C03C" in category or "(C)(3)(C)" in category or "STEM" in employer:
        return "STEM-OPT"
    # OPT
    if "C03B" in category or "(C)(3)(B)" in category:
        return "OPT"
    # CPT
    if employer or (cpt_start and cpt_end):
        return "CPT"
    # F-1 (still enrolled)
    if program_end:
        try:
            end_date = datetime.strptime(program_end, "%d %B %Y")
            if end_date > datetime.now():
                return "F-1"
        except Exception:
            pass
    return "Unknown"


# -------------------------------------------------------------
# 🪄 Unified Update Function
# -------------------------------------------------------------
def update_user_profile(user_id: str, parsed_fields: dict):
    """
    Update user's main visa record and conversational memory profile.
    This syncs OCR-extracted document data with the user_profiles memory.
    """
    stage = detect_stage(parsed_fields)

    # --- 1️⃣ Update main users collection (core profile) ---
    users_collection.update_one(
        {"_id": user_id},
        {"$set": {
            "visa_stage": stage,
            "parsed_fields": parsed_fields,
            "last_updated": datetime.utcnow()
        }},
        upsert=True
    )

    # --- 2️⃣ Sync to conversational memory ---
    profile = get_profile(user_id)
    if not profile:
        create_profile(user_id)

    essentials = {
        "employer": parsed_fields.get("Employer_Name"),
        "program_end": parsed_fields.get("Program_End_Date"),
        "cpt_start": parsed_fields.get("CPT_Start_Date"),
        "cpt_end": parsed_fields.get("CPT_End_Date"),
        "sevis_id": parsed_fields.get("SEVIS_ID"),
    }

    update_profile(user_id, {
        "status": stage,
        "stage_data": essentials,
        "last_interaction": datetime.utcnow(),
    })

    return stage
