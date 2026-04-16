from fastapi import APIRouter
from app.services.db import db

router = APIRouter(tags=["News"])

@router.get("/", summary="Get Latest Visa-Related News")
def get_latest_news(limit: int = 10):
    """Return the most recent visa-related news entries."""
    news_cursor = db.feeds.find({}, {"_id": 0}).sort("_id", -1).limit(limit)
    news = list(news_cursor)
    return {"count": len(news), "news": news}


@router.get("/categories", summary="Get News Category Counts")
def get_news_categories():
    """
    Aggregates news items in MongoDB by category for frontend filters.
    Example:
    {
      "OPT": 2,
      "H-1B": 3,
      "STEM OPT": 1,
      "CPT": 0,
      "F-1": 1
    }
    """
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    result = list(db.feeds.aggregate(pipeline))
    categories = {item["_id"]: item["count"] for item in result if item["_id"]}
    return categories
