from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Make MongoDB optional - only connect if URI is provided
MONGODB_URI = os.getenv("MONGODB_URI")

if MONGODB_URI and MONGODB_URI.strip():
    try:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        db = client["visamate"]
        print("✅ MongoDB connected")
    except Exception as e:
        print(f"⚠️ MongoDB connection failed: {e}")
        client = None
        db = None
else:
    print("⚠️ MongoDB URI not configured - running without database")
    client = None
    db = None