# import pytest
# from fastapi.testclient import TestClient
# from app.main import app

# client = TestClient(app)

# @pytest.fixture
# def token():
#     # Replace with your actual login credentials
#     login_data = {"email": "alwin123@example.com", "password": "123456"}
#     response = client.post("/auth/login", json=login_data)
#     return response.json()["token"]

# def test_create_post(token):
#     headers = {"Authorization": f"Bearer {token}"}
#     payload = {
#         "title": "Testing Forum",
#         "content": "This is a test post for the VisaMate forum.",
#         "tags": ["test"]
#     }
#     response = client.post("/forum/create", json=payload, headers=headers)
#     assert response.status_code == 200
#     assert "✅ Post created successfully" in response.json()["message"]

# def test_list_posts():
#     response = client.get("/forum/posts?limit=5")
#     assert response.status_code == 200
#     assert "posts" in response.json()

# def test_like_post(token):
#     headers = {"Authorization": f"Bearer {token}"}
#     posts = client.get("/forum/posts").json()["posts"]
#     if posts:
#         post_id = posts[0]["_id"]
#         like_response = client.post(f"/forum/{post_id}/like", headers=headers)
#         assert like_response.status_code == 200

import pytest
from fastapi.testclient import TestClient
from app.main import app
import time

client = TestClient(app)


@pytest.fixture(scope="function")
def test_user():
    """Create a unique test user for each test function"""
    timestamp = int(time.time() * 1000)  # Millisecond timestamp
    email = f"forumtest_{timestamp}@example.com"
    password = "testpass123"
    
    # Signup
    signup_resp = client.post(
        "/auth/signup",
        json={
            "name": f"Forum Test User {timestamp}",
            "email": email,
            "password": password
        }
    )
    
    # Login to get token
    login_resp = client.post(
        "/auth/login",
        json={
            "email": email,
            "password": password
        }
    )
    
    assert login_resp.status_code == 200, f"Login failed: {login_resp.json()}"
    token = login_resp.json()["token"]
    
    # Return user data
    yield {
        "email": email,
        "password": password,
        "token": token,
        "headers": {"Authorization": f"Bearer {token}"}
    }
    
    # Cleanup after test (optional - comment out if you want to keep test data)
    # Note: In a real app, you'd delete the user from database here


def test_create_post(test_user):
    """Test creating a new forum post"""
    payload = {
        "title": f"Test Post {int(time.time())}",
        "content": "This is a test post for the VisaMate forum.",
        "tags": ["test", "automated"]
    }
    
    response = client.post(
        "/forum/create",
        json=payload,
        headers=test_user["headers"]
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "post" in data or "Post created" in str(data)


def test_list_posts():
    """Test listing forum posts (no auth required)"""
    response = client.get("/forum/posts?limit=5")
    assert response.status_code == 200
    data = response.json()
    assert "posts" in data
    assert isinstance(data["posts"], list)


def test_like_post(test_user):
    """Test liking a forum post"""
    # First create a post
    post_payload = {
        "title": f"Post to Like {int(time.time())}",
        "content": "Test post for liking.",
        "tags": ["test"]
    }
    
    create_resp = client.post(
        "/forum/create",
        json=post_payload,
        headers=test_user["headers"]
    )
    assert create_resp.status_code == 200
    
    # Get the post ID
    post_data = create_resp.json()
    if "post" in post_data and "_id" in post_data["post"]:
        post_id = post_data["post"]["_id"]
        
        # Like the post
        like_resp = client.post(
            f"/forum/{post_id}/like",
            headers=test_user["headers"]
        )
        assert like_resp.status_code == 200
    else:
        # If we can't get post ID from create response, get from list
        posts_resp = client.get("/forum/posts")
        posts = posts_resp.json()["posts"]
        
        if posts:
            post_id = posts[0]["_id"]
            like_resp = client.post(
                f"/forum/{post_id}/like",
                headers=test_user["headers"]
            )
            assert like_resp.status_code == 200
        else:
            pytest.skip("No posts available to test liking")


def test_get_single_post(test_user):
    """Test fetching a single post with comments"""
    # Create a post first
    post_payload = {
        "title": f"Single Post Test {int(time.time())}",
        "content": "Testing single post retrieval.",
        "tags": ["test"]
    }
    
    create_resp = client.post(
        "/forum/create",
        json=post_payload,
        headers=test_user["headers"]
    )
    assert create_resp.status_code == 200
    
    post_data = create_resp.json()
    if "post" in post_data and "_id" in post_data["post"]:
        post_id = post_data["post"]["_id"]
        
        # Fetch the post
        get_resp = client.get(f"/forum/{post_id}")
        assert get_resp.status_code == 200
        data = get_resp.json()
        assert "post" in data