import re
from typing import Literal, Optional, Tuple

Intent = Literal[
    "declare_status",     # e.g., "I am F1", "I'm on OPT", "update to CPT"
    "update_stage",       # explicit change: "set me to OPT", "switch to STEM OPT"
    "doc_upload_intent",  # "upload I-20", "here's my EAD"
    "smalltalk",          # "thanks", "okay", "cool"
    "knowledge_query"     # default fallback -> RAG
]

STATUSES = {
    "F-1": ["f1", "f-1", "f 1"],
    "CPT": ["cpt"],
    "OPT": ["opt"],
    "STEM-OPT": ["stem opt", "stem-opt", "cpt c03c", "c03c"],
    "H-1B": ["h1b", "h-1b", "h 1 b"],
    "PROSPECTIVE": ["prospective", "admitted", "pre-arrival", "pre arrival"]
}

DOC_KEYWORDS = {
    "i20": ["i-20", "i20"],
    "ead": ["ead"],
    "i797": ["i-797", "i797"],
    "passport": ["passport"],
    "i983": ["i-983", "i983"]
}

def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()

def detect_status_token(text: str) -> Optional[str]:
    t = normalize(text)
    for status, keys in STATUSES.items():
        if any(k in t for k in keys):
            return status
    return None

def detect_document_kind(text: str) -> Optional[str]:
    t = normalize(text)
    for kind, keys in DOC_KEYWORDS.items():
        if any(k in t for k in keys):
            return kind
    return None

def detect_intent(text: str) -> Tuple[Intent, Optional[str]]:
    t = normalize(text)
    # explicit update
    if re.search(r"\b(update|set|switch|change)\b.*\b(stage|status)\b", t):
        status = detect_status_token(t)
        if status:
            return "update_stage", status
    # declaration
    if re.search(r"\b(i am|i'm|my status is|currently on)\b", t):
        status = detect_status_token(t)
        if status:
            return "declare_status", status
    # doc upload intent
    kind = detect_document_kind(t)
    if kind and ("upload" in t or "attached" in t or "attach" in t or "here is" in t):
        return "doc_upload_intent", kind
    # smalltalk
    if t in {"ok", "okay", "thanks", "thank you", "cool", "got it", "sure"}:
        return "smalltalk", None
    # default
    return "knowledge_query", None
