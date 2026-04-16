from fastapi import APIRouter, HTTPException
import bcrypt
import os
from datetime import datetime, timedelta
import jwt
from app.services.db import db
# from app.models.user import User # heya
from app.models.auth import UserSignup, UserLogin
from dotenv import load_dotenv


# Load environment variables (for JWT secret)
load_dotenv()

# 🔧 FIX: Use consistent key name - match what's in user.py
SECRET_KEY = os.getenv("JWT_SECRET", "your-secret-key-fallback")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# ✅ Removed extra prefix here
router = APIRouter(tags=["Authentication"])


# === SIGNUP ===
@router.post("/signup")
def signup(user: UserSignup):
    """Create a new user with hashed password."""
    if db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    # Hash password (bcrypt limit = 72 bytes)
    password_bytes = user.password.encode("utf-8")[:72]
    hashed_pw = bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")

    db.users.insert_one({
        "email": user.email,
        "password": hashed_pw,
        "name": user.name,
    })

    return {"message": "Signup successful ✅"}


# === LOGIN ===
@router.post("/login")
def login(user: UserLogin):
    """Authenticate user and return JWT token."""
    found = db.users.find_one({"email": user.email})
    if not found:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    password_bytes = user.password.encode("utf-8")[:72]
    if not bcrypt.checkpw(password_bytes, found["password"].encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 🔧 FIX: Create payload with 'sub' field (email) to match what user.py expects
    payload = {
        "sub": user.email,  # This is what get_current_user() looks for
        "exp": datetime.utcnow() + timedelta(hours=12),
    }

    # 🔧 FIX: Use SECRET_KEY (consistent with user.py)
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    
    print(f"🔐 Generated token for user: {user.email}")
    print(f"🔑 Token payload: {payload}")
    
    return {"token": token, "message": "Login successful ✅"}