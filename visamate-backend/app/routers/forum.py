"""
Forum Router 
-----------------------------------
VisaMate's user community discussion system.

✅ Features
1️⃣ Create new posts
2️⃣ View paginated + filtered posts
3️⃣ Fetch single post with comments
4️⃣ Add comments to posts
5️⃣ Like / upvote posts
6️⃣ Filter by visa stage or tag
"""

from fastapi import APIRouter, Depends, HTTPException, Body, Query
from app.models.user import get_current_user
from app.services.db import db
from bson import ObjectId
from datetime import datetime

router = APIRouter(tags=["Forum"])

# === Utility ===
def serialize_doc(doc):
    """Converts ObjectId → str for frontend safety."""
    if not doc:
        return None
    doc["_id"] = str(doc["_id"])
    return doc


# 📝 Create a new post
@router.post("/create", summary="Create a new forum post")
def create_post(
    data: dict = Body(...),
    current_user=Depends(get_current_user)
):
    if not all(k in data for k in ["title", "content"]):
        raise HTTPException(status_code=400, detail="Missing required fields: title, content")

    post = {
        "user_id": current_user["_id"],
        "user_email": current_user.get("email"),
        "title": data["title"].strip(),
        "content": data["content"].strip(),
        "tags": [t.lower() for t in data.get("tags", [])],
        "visa_stage": current_user.get("visa_stage", "UNKNOWN"),
        "timestamp": datetime.utcnow(),
        "likes": 0,
        "liked_by": [],
    }

    result = db.posts.insert_one(post)
    post["_id"] = str(result.inserted_id)

    return {"message": "✅ Post created successfully", "post": post}


# 📜 Get list of posts (filter + pagination)
@router.get("/posts", summary="List forum posts (with optional filters)")
def list_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, le=50),
    visa_stage: str | None = None,
    tag: str | None = None,
    sort_by: str = Query("timestamp", description="Field to sort by (timestamp/likes)"),
):
    filters = {}
    if visa_stage:
        filters["visa_stage"] = visa_stage.upper()
    if tag:
        filters["tags"] = tag.lower()

    posts = (
        db.posts.find(filters)
        .sort(sort_by, -1)
        .skip(skip)
        .limit(limit)
    )

    return {
        "count": db.posts.count_documents(filters),
        "posts": [serialize_doc(p) for p in posts],
    }


# 🔍 Get a single post and its comments
@router.get("/{post_id}", summary="Fetch single post with its comments")
def get_post(post_id: str):
    post = db.posts.find_one({"_id": str(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comments = list(db.comments.find({"post_id": post_id}).sort("timestamp", 1))
    post = serialize_doc(post)
    for c in comments:
        c["_id"] = str(c["_id"])

    return {"post": post, "comments": comments}


# 💬 Add a comment
@router.post("/{post_id}/comment", summary="Add comment to a post")
def add_comment(
    post_id: str,
    data: dict = Body(...),
    current_user=Depends(get_current_user)
):
    if not db.posts.find_one({"_id": str(post_id)}):
        raise HTTPException(status_code=404, detail="Post not found")

    comment = {
        "post_id": post_id,
        "user_id": current_user["_id"],
        "user_email": current_user.get("email"),
        "text": data["text"].strip(),
        "timestamp": datetime.utcnow(),
    }
    db.comments.insert_one(comment)
    return {"message": "💬 Comment added successfully", "comment": comment}


# 👍 Like / unlike post
@router.post("/{post_id}/like", summary="Like or unlike a post")
def like_post(
    post_id: str,
    current_user=Depends(get_current_user)
):
    user_id = current_user["_id"]
    post = db.posts.find_one({"_id": str(post_id)})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Toggle like
    if user_id in post.get("liked_by", []):
        db.posts.update_one(
            {"_id": str(post_id)},
            {"$pull": {"liked_by": user_id}, "$inc": {"likes": -1}}
        )
        action = "unliked"
    else:
        db.posts.update_one(
            {"_id": str(post_id)},
            {"$addToSet": {"liked_by": user_id}, "$inc": {"likes": 1}}
        )
        action = "liked"

    updated = db.posts.find_one({"_id": str(post_id)})
    return {
        "message": f"✅ Post {action} successfully",
        "likes": updated.get("likes", 0),
    }
