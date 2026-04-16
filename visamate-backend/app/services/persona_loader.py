import os, json
from typing import Dict, Any, Optional
from functools import lru_cache

try:
    import yaml  # optional: pip install pyyaml
    HAS_YAML = True
except Exception:
    HAS_YAML = False

PERSONA_DIR = os.path.join(os.getcwd(), "data", "persona")

def _load_file(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        if path.endswith(".json"):
            return json.load(f)
        if path.endswith((".yml", ".yaml")) and HAS_YAML:
            return yaml.safe_load(f)
        raise RuntimeError("Persona files must be .json or .yaml")

@lru_cache(maxsize=1)
def load_persona() -> Dict[str, Any]:
    """
    Loads and merges persona files from data/persona/*
    Expects keys like:
      - onboarding.initial_greeting
      - flows.f1.questions[], flows.cpt.questions[] ...
      - tones.language_principles, do_dont, etc. (optional)
    """
    merged: Dict[str, Any] = {"onboarding": {}, "flows": {}, "tones": {}}
    if not os.path.isdir(PERSONA_DIR):
        return merged

    for name in os.listdir(PERSONA_DIR):
        if not name.lower().endswith((".json", ".yml", ".yaml")):
            continue
        doc = _load_file(os.path.join(PERSONA_DIR, name))
        for k, v in doc.items():
            if isinstance(v, dict):
                merged.setdefault(k, {}).update(v)
            else:
                merged[k] = v
    return merged

def reload_persona():
    # Clear cache next call
    load_persona.cache_clear()
    return load_persona()
