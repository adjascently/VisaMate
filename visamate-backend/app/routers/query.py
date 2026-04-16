"""
app/routers/query.py
----------------------------------
Handles user queries for VisaMate.

Unified pipeline:
1️⃣ Retrieve relevant USCIS/SEVP documents (filtered by user's visa stage)
2️⃣ Generate a draft answer (via GPT-4o)
3️⃣ Verify with Claude + Gemini + compute trust score
4️⃣ Return structured, JSON-ready response
"""

from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.query_schemas import QueryRequest
from app.models.user import get_current_user
from app.services.mcp_updater import fetch_and_ingest_latest_updates
from app.services.query_service import query_visa_facts  # ✅ unified shared engine

router = APIRouter(tags=["Query"])

# ============================================================
# 🔹 Main Query Endpoint
# ============================================================
@router.post("/", summary="Query the VisaMate knowledge base")
def query_api(request: QueryRequest, current_user=Depends(get_current_user)):
    """
    Handles visa-related user queries using the unified AI pipeline.

    Steps:
    1️⃣ Retrieve relevant documents filtered by user's visa_stage
    2️⃣ Generate draft answer using GPT-4o
    3️⃣ Run verification (Claude + Gemini)
    4️⃣ Return structured, trust-scored response
    """
    query = request.query.strip()
    visa_stage = current_user.get("visa_stage", "UNKNOWN")

    # ✅ Run through the shared RAG + verification engine
    result = query_visa_facts(query, visa_stage)
    result["visa_stage_used"] = visa_stage
    return result


# ============================================================
# 🔁 Admin: Manually Refresh USCIS Corpus
# ============================================================
@router.get("/update-corpus", summary="Force-refresh USCIS corpus (Admin only)")
def update_corpus(current_user=Depends(get_current_user)):
    """
    🔒 Admin-only endpoint.
    Forces the backend to refetch and re-embed the latest USCIS news corpus.
    """
    if current_user.get("email") != "admin@visamate.ai":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Only admin users can refresh the corpus."
        )

    fetch_and_ingest_latest_updates()
    return {"message": "✅ USCIS corpus refreshed and embedded into Chroma!"}
