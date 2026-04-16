"""
app/services/verification.py
--------------------------------
Verification & Trust Engine
Combines multi-model (Claude + Gemini) feedback
to compute a dynamically weighted trust score for VisaMate answers.
"""

from typing import List, Dict, Optional
from dataclasses import dataclass
from app.services.multimodel import query_model
import logging

logger = logging.getLogger(__name__)


@dataclass
class SourceChunk:
    """Represents a retrieved document snippet used as evidence."""
    doc_id: str
    filename: str
    snippet: str
    score: float
    url: Optional[str] = None


# === Individual scoring utilities ===
def cross_agreement_score(primary: str, feedbacks: List[str]) -> float:
    """Aggregate multi-model agreement score."""
    text = " ".join(f.lower() for f in feedbacks)
    pos = sum(k in text for k in ["agree", "correct", "supported", "consistent", "accurate"])
    neg = sum(k in text for k in ["incorrect", "contradict", "hallucination", "unsupported", "wrong"])
    raw = 0.25 * pos - 0.2 * neg + 0.5
    return max(0.0, min(1.0, round(raw, 3)))


def source_reliability_score(sources: List[SourceChunk]) -> float:
    """Rate reliability of retrieved evidence."""
    if not sources:
        return 0.5
    total = 0
    for s in sources:
        name, url = (s.filename or "").lower(), (s.url or "").lower()
        if "uscis" in url or ".gov" in url:
            base = 1.0
        elif ".edu" in url:
            base = 0.8
        elif name.endswith(".pdf"):
            base = 0.6
        else:
            base = 0.4
        total += 0.5 * base + 0.5 * min(1.0, s.score)
    return round(min(1.0, total / len(sources)), 3)


def compute_trust(primary: str, feedbacks: Dict[str, str], sources: List[SourceChunk]) -> Dict:
    """
    Combine model agreement + source reliability using dynamic weighting.
    - If no sources retrieved → rely mostly on model agreement.
    - If sources exist → balance both factors.
    """
    ca = cross_agreement_score(primary, list(feedbacks.values()))
    sr = source_reliability_score(sources)

    # === 🧠 Dynamic weighting logic ===
    if not sources or len(sources) == 0:
        # No retrieved context → trust model consensus more
        trust = 0.8 * ca + 0.2 * sr
    else:
        # Retrieved evidence present → balance both
        trust = 0.55 * ca + 0.45 * sr

    trust = round(trust, 3)

    # === Flag potential weaknesses ===
    flags = []
    if ca < 0.5:
        flags.append("low_cross_agreement")
    if sr < 0.6:
        flags.append("weak_sources")

    return {
        "trust_score": trust,
        "cross_agreement": ca,
        "source_reliability": sr,
        "feedbacks": feedbacks,
        "rationale": "Dynamic weighted blend of model agreement and source reliability.",
        "flags": flags,
    }


# === Verification pipeline ===
def run_verification_pipeline(query: str, context: str, primary_answer: str, sources: List[SourceChunk]) -> Dict:
    """
    1️⃣ GPT-4o produces primary answer.
    2️⃣ Claude Sonnet 3.5 & Gemini 2.0 Flash Lite verify it.
    3️⃣ Trust score computed from agreement + source reliability.
    """
    feedbacks = {}
    try:
        feedbacks["claude"] = query_model(
            "claude",
            f"Review this answer for accuracy:\n\nQ: {query}\n\nA: {primary_answer}\n\nContext: {context}"
        )
    except Exception as e:
        feedbacks["claude"] = f"⚠️ Claude error: {e}"

    try:
        feedbacks["gemini"] = query_model(
            "gemini",
            f"Verify factual correctness of this answer:\n\nQ: {query}\n\nA: {primary_answer}\n\nBe concise."
        )
    except Exception as e:
        feedbacks["gemini"] = f"⚠️ Gemini error: {e}"

    trust = compute_trust(primary_answer, feedbacks, sources)

    return {
        "answer": primary_answer,
        "sources": [s.__dict__ for s in sources],
        "trust_score": trust["trust_score"],
        "verification": trust,
    }
