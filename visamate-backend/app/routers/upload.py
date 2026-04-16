"""
app/routers/upload.py
----------------------------------
Handles file uploads (I-20, EAD, Passport, etc.)
Performs OCR, document-type detection, and field extraction.
Updates MongoDB and returns parsed results to frontend.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.services.ocr import ocr_tesseract, detect_doc_type, parse_fields
from app.services.user_profile import update_user_profile
from app.models.user import get_current_user
from app.db import documents_collection
from bson import ObjectId
import datetime


router = APIRouter(prefix="/upload", tags=["Upload"])


@router.post("/")
async def upload_document(
    file: UploadFile = File(...),
    # Temporarily bypass auth (guest user fallback)
    current_user: dict = Depends(get_current_user) if False else {"_id": "guest", "email": "guest@visamate.ai"}
):
    """
    📄 Upload Visa Document (I-20, EAD, DS-2019, etc.)

    Steps:
    1️⃣ Extract text using OCR (Tesseract).
    2️⃣ Detect document type (I-20, EAD, etc.)
    3️⃣ Parse key visa-related fields (SEVIS ID, program end date, employer).
    4️⃣ Store metadata in MongoDB.
    5️⃣ Update user’s visa stage in profile (CPT / OPT / STEM / H1B).
    """
    try:
        print(f"\n📤 Upload started by user: {current_user.get('email')}")
        print(f"📁 File: {file.filename}, Content-Type: {file.content_type}")

        # === Step 1: Read & OCR file ===
        file_bytes = await file.read()
        print(f"📊 File size: {len(file_bytes)} bytes")

        text = ocr_tesseract(file_bytes)
        if not text.strip():
            raise HTTPException(status_code=400, detail="OCR extraction failed — no readable text found.")

        # === Step 2: Detect document type + parse fields ===
        doc_type = detect_doc_type(text)
        parsed_fields = parse_fields(doc_type, text)
        print(f"🧾 Parsed fields: {parsed_fields}")

        # === Step 3: Save metadata to DB ===
        doc_entry = {
            "user_id": current_user["_id"],
            "filename": file.filename,
            "doc_type": doc_type,
            "parsed_fields": parsed_fields,
            "upload_date": datetime.datetime.utcnow(),
        }
        result = documents_collection.insert_one(doc_entry)
        print(f"💾 Document saved with ID: {result.inserted_id}")

        # === Step 4: Update user profile visa stage ===
        try:
            detected_stage = update_user_profile(current_user["_id"], parsed_fields)
            print(f"🎯 Detected visa stage: {detected_stage}")
        except Exception as e:
            detected_stage = "Unknown"
            print(f"⚠️ Profile update skipped: {e}")

        # === Step 5: Return structured response ===
        return {
            "message": "File processed successfully",
            "document_id": str(result.inserted_id),
            "doc_type": doc_type,
            "parsed_fields": parsed_fields,
            "detected_stage": detected_stage,
        }

    except Exception as e:
        print(f"❌ Upload error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
