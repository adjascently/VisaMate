"""
app/services/multimodel.py
----------------------------------
Multi-Model Interface for Verification
Supports:
  • GPT-4o  (OpenAI)
  • Claude Sonnet (Anthropic)
  • Gemini Flash Lite (Google)
Used for cross-verification and trust scoring.
"""

import os
import logging
import openai
import anthropic
import google.generativeai as genai
from app.utils.env_loader import load_env
load_env()

# ---------------------------------------------------------------------------
# 🔐  API Key Configuration
# ---------------------------------------------------------------------------
openai.api_key = os.getenv("OPENAI_API_KEY")

anthropic_client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# ---------------------------------------------------------------------------
# 🧠  Default Model Names (with fallbacks)
# ---------------------------------------------------------------------------
CLAUDE_PRIMARY = "claude-sonnet-4-5"               # Latest as of Nov 2025
CLAUDE_FALLBACK = "claude-3-5-sonnet-20241022"    # Previous version
GEMINI_MODEL = "gemini-2.0-flash-lite"
GPT_MODEL = "gpt-4o"

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# 🚀  Unified Query Interface
# ---------------------------------------------------------------------------
def query_model(model_name: str, prompt: str) -> str:
    """
    Send a prompt to the selected LLM and return a concise text response.

    Supported identifiers:
      - "gpt4o" / "gpt-4o"
      - "claude" / "sonnet"
      - "gemini" / "flash" / "lite"
    """
    model_name = model_name.lower().strip()

    # === GPT-4o (OpenAI) ===
    if model_name in {"gpt4o", "gpt-4o"}:
        try:
            res = openai.chat.completions.create(
                model=GPT_MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=300,
            )
            return res.choices[0].message.content.strip()
        except Exception as e:
            raise RuntimeError(f"GPT-4o error → {e}")

    # === Claude Sonnet (Anthropic) ===
    elif "claude" in model_name or "sonnet" in model_name:
        try:
            try:
                # Try latest Sonnet-4-5 first
                resp = anthropic_client.messages.create(
                    model=CLAUDE_PRIMARY,
                    max_tokens=300,
                    messages=[{"role": "user", "content": prompt}],
                )
            except Exception as e_primary:
                logger.warning(f"Primary Claude model failed → {e_primary}; using fallback.")
                resp = anthropic_client.messages.create(
                    model=CLAUDE_FALLBACK,
                    max_tokens=300,
                    messages=[{"role": "user", "content": prompt}],
                )
            return resp.content[0].text.strip()
        except Exception as e:
            raise RuntimeError(f"Claude error → {e}")

    # === Gemini Flash Lite (Google) ===
    elif any(k in model_name for k in ["gemini", "flash", "lite"]):
        try:
            model = genai.GenerativeModel(GEMINI_MODEL)
            result = model.generate_content(prompt)
            if hasattr(result, "text") and result.text:
                return result.text.strip()
            # Gemini responses sometimes appear in .candidates[0].content.parts
            if hasattr(result, "candidates") and result.candidates:
                part = result.candidates[0].content.parts[0]
                return getattr(part, "text", "").strip()
            return ""
        except Exception as e:
            raise RuntimeError(f"Gemini error → {e}")

    else:
        raise ValueError(f"❌ Unknown model name: {model_name}")


# ---------------------------------------------------------------------------
# 🧪  CLI Sanity Test
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    test_prompt = "Say hello briefly!"
    for m in ["gpt4o", "claude", "gemini"]:
        print(f"\n🔍 Testing {m} →")
        try:
            reply = query_model(m, test_prompt)
            print("✅ Response:", reply)
        except Exception as e:
            print(f"⚠️ {m} failed → {e}")
