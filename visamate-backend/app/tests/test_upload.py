# from fastapi.testclient import TestClient
# from app.main import app

# client = TestClient(app)

# def test_upload_updates_stage(monkeypatch):
#     async def mock_ocr_tesseract(x): 
#         return ("dummy text", {"Category": "C03C"})
#     monkeypatch.setattr("app.services.ocr.ocr_tesseract", mock_ocr_tesseract)

#     resp = client.post("/upload", files={"file": ("test.pdf", b"fake")})
#     assert resp.status_code == 200
#     assert resp.json()["detected_stage"] == "STEM-OPT"


import pytest
from fastapi.testclient import TestClient
from app.main import app
import time

client = TestClient(app)


@pytest.fixture(scope="function")
def test_user():
    """Create a unique test user for each test"""
    timestamp = int(time.time() * 1000)
    email = f"uploadtest_{timestamp}@example.com"
    password = "testpass123"
    
    # Signup
    signup_resp = client.post(
        "/auth/signup",
        json={
            "name": f"Upload Test User {timestamp}",
            "email": email,
            "password": password
        }
    )
    
    # Login
    login_resp = client.post(
        "/auth/login",
        json={
            "email": email,
            "password": password
        }
    )
    
    assert login_resp.status_code == 200
    token = login_resp.json()["token"]
    
    yield {
        "email": email,
        "token": token,
        "headers": {"Authorization": f"Bearer {token}"}
    }


def test_upload_requires_authentication():
    """Test that upload endpoint requires authentication"""
    response = client.post(
        "/upload/",
        files={"file": ("test.pdf", b"fake pdf content")}
    )
    # Should return 403 Forbidden (no auth token)
    assert response.status_code == 403


def test_upload_invalid_token():
    """Test upload with invalid token"""
    response = client.post(
        "/upload/",
        files={"file": ("test.pdf", b"fake")},
        headers={"Authorization": "Bearer invalid_token_12345"}
    )
    assert response.status_code == 401  # Unauthorized


def test_upload_with_mocked_ocr(test_user, monkeypatch):
    """Test upload with properly mocked OCR functions"""
    
    # Mock OCR to return EAD document text
    def mock_ocr_tesseract(file_bytes):
        return """
        Employment Authorization Document
        Category: C03C
        Employer Name: Tech Company Inc.
        """
    
    # Mock document type detection  
    def mock_detect_doc_type(text):
        return "EAD"
    
    # Mock field parsing
    def mock_parse_fields(doc_type, text):
        return {
            "Category": "C03C",
            "Employer_Name": "Tech Company Inc."
        }
    
    # Patch at the module level where they're used
    monkeypatch.setattr("app.routers.upload.ocr_tesseract", mock_ocr_tesseract)
    monkeypatch.setattr("app.routers.upload.detect_doc_type", mock_detect_doc_type)
    monkeypatch.setattr("app.routers.upload.parse_fields", mock_parse_fields)
    
    # Upload with authentication
    response = client.post(
        "/upload/",
        files={"file": ("test.pdf", b"fake pdf content")},
        headers=test_user["headers"]
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["detected_stage"] == "STEM-OPT"
    assert data["doc_type"] == "EAD"
    assert "document_id" in data


def test_upload_i20_document(test_user, monkeypatch):
    """Test uploading I-20 document and detecting CPT stage"""
    
    # Mock OCR to return I-20 content
    def mock_ocr_tesseract(file_bytes):
        return """
        Form I-20
        SEVIS ID: N0012345678
        EMPLOYER INFORMATION
        Test Company LLC
        CPT 01 JULY 2025 - 29 AUGUST 2025
        """
    
    def mock_detect_doc_type(text):
        return "I-20"
    
    def mock_parse_fields(doc_type, text):
        return {
            "SEVIS_ID": "N0012345678",
            "Employer_Name": "Test Company LLC",
            "CPT_Start_Date": "01 JULY 2025",
            "CPT_End_Date": "29 AUGUST 2025"
        }
    
    # Apply mocks
    monkeypatch.setattr("app.routers.upload.ocr_tesseract", mock_ocr_tesseract)
    monkeypatch.setattr("app.routers.upload.detect_doc_type", mock_detect_doc_type)
    monkeypatch.setattr("app.routers.upload.parse_fields", mock_parse_fields)
    
    # Upload I-20
    response = client.post(
        "/upload/",
        files={"file": ("i20.pdf", b"fake i20 content")},
        headers=test_user["headers"]
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["doc_type"] == "I-20"
    assert data["detected_stage"] == "CPT"
    assert data["parsed_fields"]["Employer_Name"] == "Test Company LLC"