"""
User Model & Authentication Utilities
-------------------------------------
Handles:
- User schema validation
- JWT authentication
- MongoDB access (users collection)
- Conversation profile utilities for VisaMate chat
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from bson import ObjectId
from pydantic import BaseModel, EmailStr
from app.services.db import db  # ✅ using your db service layer
import os
from dotenv import load_dotenv

# ============================================================
# 🔹 MongoDB Setup
# ============================================================
if db is not None:
    users_collection = db.users
else:
    users_collection = None

# ============================================================
# 🔹 Load Environment Variables
# ============================================================
load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key-fallback")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

print(f"🔑 Loaded SECRET_KEY from .env: {SECRET_KEY[:10]}...")

# ============================================================
# 🔹 Auth Setup
# ============================================================
oauth2_scheme = HTTPBearer()


class User(BaseModel):
    name: str
    email: EmailStr
    password: str


# ============================================================
# 🔹 JWT Validation Function
# ============================================================
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme)):
    """
    Extracts Bearer token from Authorization header,
    decodes JWT, and fetches the corresponding MongoDB user.
    """
    token = credentials.credentials

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"🔓 Decoded JWT payload: {payload}")

        user_id = payload.get("user_id")
        email = payload.get("sub")
        user = None

        if user_id:
            try:
                user_obj_id = ObjectId(user_id)
                user = users_collection.find_one({"_id": user_obj_id})
            except Exception as e:
                print(f"❌ Error converting user_id to ObjectId: {e}")
                raise credentials_exception

        elif email:
            user = users_collection.find_one({"email": email})

        if not user:
            print("❌ User not found in database")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        user["_id"] = str(user["_id"])  # make ObjectId JSON serializable
        print(f"✅ Authenticated: {user.get('email')}")
        return user

    except JWTError as e:
        print(f"❌ JWT Error: {e}")
        raise credentials_exception


# ============================================================
# 🔹 Chat Profile Utilities (for unified /chat endpoint)
# ============================================================

def get_user_profile(user_id: str):
    """
    Fetch the user's full profile (including chat history, stage, etc.).
    Returns None if user doesn't exist.
    """
    try:
        user = users_collection.find_one({"_id": str(user_id)})
        if not user:
            return None
        user["_id"] = str(user["_id"])
        return user
    except Exception as e:
        print(f"⚠️ get_user_profile error: {e}")
        return None


def update_profile(user_id: str, updates: dict):
    """
    Update specific profile fields in the users collection.
    Creates user doc if not found (upsert=True).
    """
    try:
        users_collection.update_one(
            {"_id": str(user_id)},
            {"$set": updates},
            upsert=True
        )
        print(f"🧩 Updated profile for {user_id} → {list(updates.keys())}")
    except Exception as e:
        print(f"⚠️ update_profile error: {e}")
