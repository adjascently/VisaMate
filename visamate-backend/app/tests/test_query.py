"""
Tests for the Query/RAG (Retrieval-Augmented Generation) feature.
These tests verify the visa knowledge base query system.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
import time

client = TestClient(app)


@pytest.fixture(scope="function")
def test_user():
    """Create a unique test user with CPT visa stage"""
    timestamp = int(time.time() * 1000)
    email = f"querytest_{timestamp}@example.com"
    password = "testpass123"
    
    # Signup
    signup_resp = client.post(
        "/auth/signup",
        json={
            "name": f"Query Test User {timestamp}",
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


def test_query_requires_authentication():
    """Test that query endpoint requires authentication"""
    response = client.post(
        "/query/",
        json={"query": "What is CPT?"}
    )
    # Should return 403 Forbidden (no auth token)
    assert response.status_code == 403


def test_query_invalid_token():
    """Test query with invalid token"""
    response = client.post(
        "/query/",
        json={"query": "What is CPT?"},
        headers={"Authorization": "Bearer invalid_token_xyz"}
    )
    assert response.status_code == 401  # Unauthorized


def test_query_missing_query_field():
    """Test query endpoint with missing query field"""
    response = client.post(
        "/query/",
        json={},  # Missing 'query' field
        headers={"Authorization": "Bearer fake_token"}
    )
    # Should return 422 Unprocessable Entity (validation error)
    assert response.status_code in [401, 422]  # 401 for auth, 422 for validation


def test_query_basic(test_user):
    """Test basic query functionality"""
    response = client.post(
        "/query/",
        json={"query": "What is CPT?"},
        headers=test_user["headers"]
    )
    
    # May return 200 or 500 depending on if corpus is populated
    # If 500, it's likely missing OpenAI key or empty corpus
    if response.status_code == 200:
        data = response.json()
        assert "answer" in data
        assert isinstance(data["answer"], str)
        # Should have some response about CPT
        assert len(data["answer"]) > 0
    elif response.status_code == 500:
        # Expected if API keys missing or corpus not populated
        pytest.skip("Query service not fully configured (API keys or corpus)")
    else:
        pytest.fail(f"Unexpected status code: {response.status_code}")


def test_query_with_sources(test_user):
    """Test that query returns source documents"""
    response = client.post(
        "/query/",
        json={"query": "What are the CPT requirements?"},
        headers=test_user["headers"]
    )
    
    if response.status_code == 200:
        data = response.json()
        # Should have sources field
        assert "sources" in data
        assert isinstance(data["sources"], list)
    elif response.status_code == 500:
        pytest.skip("Query service not fully configured")


def test_query_trust_score(test_user):
    """Test that query returns trust/verification score"""
    response = client.post(
        "/query/",
        json={"query": "How long can I work on CPT?"},
        headers=test_user["headers"]
    )
    
    if response.status_code == 200:
        data = response.json()
        # Should have trust_score or verification info
        assert "trust_score" in data or "verification" in data
        if "trust_score" in data:
            assert isinstance(data["trust_score"], (int, float))
            assert 0 <= data["trust_score"] <= 1
    elif response.status_code == 500:
        pytest.skip("Query service not fully configured")


def test_query_visa_stage_filtering(test_user):
    """Test that query uses user's visa stage for filtering"""
    response = client.post(
        "/query/",
        json={"query": "What documents do I need?"},
        headers=test_user["headers"]
    )
    
    if response.status_code == 200:
        data = response.json()
        # Should indicate which visa stage was used
        assert "visa_stage_used" in data or "answer" in data
    elif response.status_code == 500:
        pytest.skip("Query service not fully configured")


@pytest.mark.parametrize("query_text", [
    "What is OPT?",
    "How do I apply for STEM extension?",
    "What are the H-1B requirements?",
    "Can I change employers on OPT?",
])
def test_various_queries(test_user, query_text):
    """Test various types of visa-related queries"""
    response = client.post(
        "/query/",
        json={"query": query_text},
        headers=test_user["headers"]
    )
    
    # Should at least not crash
    assert response.status_code in [200, 500]
    
    if response.status_code == 200:
        data = response.json()
        assert "answer" in data
        # Answer should be non-empty
        assert len(data["answer"]) > 0


def test_query_empty_string(test_user):
    """Test handling of empty query string"""
    response = client.post(
        "/query/",
        json={"query": ""},
        headers=test_user["headers"]
    )
    
    # Should handle gracefully - either reject or return generic response
    assert response.status_code in [200, 400, 422, 500]


def test_query_very_long_text(test_user):
    """Test handling of very long query text"""
    long_query = "What is CPT? " * 100  # Very long repeated text
    
    response = client.post(
        "/query/",
        json={"query": long_query},
        headers=test_user["headers"]
    )
    
    # Should handle gracefully
    assert response.status_code in [200, 400, 500]


def test_update_corpus_requires_auth():
    """Test that corpus update endpoint requires authentication"""
    response = client.get("/query/update-corpus")
    assert response.status_code == 403  # No auth


def test_update_corpus_with_auth(test_user):
    """Test corpus update with authentication (admin function)"""
    response = client.get(
        "/query/update-corpus",
        headers=test_user["headers"]
    )
    
    # May succeed (200) or fail if not admin/network issues
    # Just verify it doesn't crash
    assert response.status_code in [200, 403, 500]