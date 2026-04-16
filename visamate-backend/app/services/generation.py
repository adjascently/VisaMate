"""
app/services/generation.py
----------------------------------
Primary answer generator using GPT-4o.
Compatible with OpenAI Python SDK v0.28 (old syntax).
"""

import os
import openai
from dotenv import load_dotenv

# === Load environment variables ===
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")   # <-- FIXED

# === Load Persona Files ===
BASE_PATH = os.path.join("app", "data", "persona")

def load_file(filename: str) -> str:
    """Safely load a text file (persona or interaction patterns)."""
    try:
        path = os.path.join(BASE_PATH, filename)
        with open(path, "r") as f:
            return f.read().strip()
    except Exception as e:
        print(f"⚠️ Could not load {filename}: {e}")
        return ""

VISAMATE_PERSONA = load_file("visamate_persona.txt")
INTERACTION_PATTERNS = load_file("interaction_patterns.txt")[:3000]  # trimmed


def generate_primary_answer(query: str, context: str = "") -> str:
    """
    Generates a grounded VisaMate-style answer using GPT-4o.
    Uses OpenAI ChatCompletion (old syntax).
    """

    prompt = f"""
{VISAMATE_PERSONA}

Behavioral & Interaction Patterns:
{INTERACTION_PATTERNS}

You are VisaMate — a professional, compliance-oriented immigration advisor.

Question:
{query}

Relevant context (from USCIS/SEVP sources):
{context if context else "No retrieved documents found in the database."}

Task:
Provide a concise, factual, USCIS-aligned answer (2–4 sentences).
Use a formal, supportive, compliance-oriented tone.
Only rely on verified policy information.
"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            max_tokens=350
        )
        return response["choices"][0]["message"]["content"].strip()

    except Exception as e:
        print(f"⚠️ GPT-4o generation error: {e}")
        return ""
