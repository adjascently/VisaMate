"""
Session Memory Service
----------------------
Handles conversational memory for each user:
- Append messages (assistant/user)
- Retrieve full chat history
"""

from app.db import users_collection
from datetime import datetime


def append_message(user_id: str, role: str, content: str):
    """
    Add a new message to the user's chat history in MongoDB.
    Creates the user doc if not present.
    """
    users_collection.update_one(
        {"_id": user_id},
        {
            "$push": {
                "history": {
                    "role": role,
                    "content": content,
                    "timestamp": datetime.utcnow(),
                }
            }
        },
        upsert=True,
    )


def get_full_history(user_id: str):
    """
    Fetch the entire stored chat history for a user.
    Returns a list of message dicts (role, content, timestamp).
    """
    user = users_collection.find_one({"_id": user_id}, {"history": 1})
    if not user:
        return []
    return user.get("history", [])
