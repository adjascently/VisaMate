from pymongo import MongoClient
import os
from dotenv import load_dotenv

# ✅ Load environment variables from .env file
load_dotenv()

# ✅ Get MongoDB URI from environment variable
MONGO_URI = os.getenv("MONGODB_URI")

if not MONGO_URI:
    raise ValueError("❌ MONGODB_URI not found in environment variables!")

# ✅ Connect to MongoDB
client = MongoClient(MONGO_URI)

# ✅ Create or use an existing database
db = client["visamate_db"]

# ✅ Collections
users_collection = db["users"]
documents_collection = db["documents"]
queries_collection = db["queries"]

print("✅ MongoDB connected successfully")
