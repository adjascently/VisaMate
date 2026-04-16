from typing import Dict, Any, List, Optional
from datetime import datetime
from app.services.persona_loader import load_persona
from app.services.nlg_templates import render_questions, render_upload_prompt

def start_greeting(profile: Dict[str, Any]) -> List[str]:
    p = load_persona()
    greeting = p.get("onboarding", {}).get(
        "initial_greeting",
        "Hello and welcome to VisaMate — your professional immigration compliance advisor."
    )
    # Only greet once; after that, use tight prompts
    if not profile.get("first_greeting_done"):
        return [greeting, p.get("onboarding", {}).get("status_prompt",
                "To personalize guidance, what is your current immigration status? (F-1, CPT, OPT, STEM-OPT, H-1B, Prospective, Other)")]
    return []

def next_for_status(status: str) -> List[str]:
    """Return persona-authored questions for given status."""
    p = load_persona().get("flows", {})
    key = status.lower().replace("-", "")
    # accepted keys: 'f1', 'cpt', 'opt', 'stemopt', 'h1b', 'prospective'
    mapping = {
        "f-1": "f1", "f1": "f1", "cpt": "cpt", "opt": "opt",
        "stem-opt": "stemopt", "stemopt": "stemopt",
        "h-1b": "h1b", "h1b": "h1b", "prospective": "prospective"
    }
    lk = mapping.get(status.lower(), status.lower())
    block = p.get(lk, {})
    q = block.get("questions", [])
    preamble = block.get("preamble", "")
    out = []
    if preamble:
        out.append(preamble)
    if q:
        out.extend(render_questions(q))
    # upload prompt?
    up = block.get("upload_prompt")
    if up:
        out.append(render_upload_prompt(up))
    return out
