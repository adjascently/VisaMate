from fastapi import APIRouter
from pydantic import BaseModel
from app.services.query_service import query_visa_facts

router = APIRouter()

class EvalQuery(BaseModel):
    query: str

@router.post("/eval")
async def evaluation_endpoint(payload: EvalQuery):
    """
    Evaluation-only endpoint for benchmarking VisaMate.
    - No persona
    - No sessions
    - No user memory
    - No onboarding
    - Pure factual RAG + verification answer
    """

    result = query_visa_facts(
        query=payload.query,
        visa_stage="None"   # disable stage filtering during eval
    )

    # RAG + Verification returns a dict like:
    # {
    #   "primary_answer": "...",
    #   "final_answer": "...",
    #   "trust_score": 0.92,
    #   ...
    # }

    return {
        "answer": result.get("final_answer") or result.get("primary_answer"),
        "trust_score": result.get("trust_score", None),
    }
