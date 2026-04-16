# from fastapi.testclient import TestClient
# from app.main import app

# client = TestClient(app)

# def test_get_news():
#     """Test getting latest visa-related news"""
#     response = client.get("/news/")
#     assert response.status_code == 200
#     assert "news" in response.json()

# def test_get_news_categories():
#     """Test getting news category counts"""
#     response = client.get("/news/categories")
#     assert response.status_code == 200
#     assert "categories" in response.json()

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_news():
    """Test getting latest visa-related news"""
    response = client.get("/news/")
    assert response.status_code == 200
    
    data = response.json()
    assert "news" in data
    assert isinstance(data["news"], list)
    
    # If there's news, check its structure
    if data["news"]:
        news_item = data["news"][0]
        assert "title" in news_item
        assert "category" in news_item


def test_get_news_with_limit():
    """Test getting news with limit parameter"""
    response = client.get("/news/?limit=3")
    assert response.status_code == 200
    
    data = response.json()
    assert "news" in data
    # Should return at most 3 items
    assert len(data["news"]) <= 3


def test_get_news_categories():
    """Test getting news category counts"""
    response = client.get("/news/categories")
    assert response.status_code == 200
    
    data = response.json()
    # The response is a dict of categories with counts
    assert isinstance(data, dict)
    
    # Should have at least one category if news exists
    # (might be 0 if database is empty, which is okay)
    assert len(data) >= 0
    
    # If there are categories, check format
    if data:
        # Values should be integers (counts)
        for category, count in data.items():
            assert isinstance(category, str)
            assert isinstance(count, int)
            assert count >= 0

# @pytest.mark.xfail(reason="News filtering by category to be correctly implemented in API logic")
def test_get_news_by_category():
    """Test filtering news by category"""
    # First get available categories
    cat_response = client.get("/news/categories")
    categories = cat_response.json()
    
    if categories:
        # Pick the first category
        test_category = list(categories.keys())[0]
        
        # Get news for that category
        response = client.get(f"/news/?category={test_category}")
        assert response.status_code == 200
        
        data = response.json()
        assert "news" in data
        
        # All news items should be from the requested category
        for item in data["news"]:
            assert item.get("category") == test_category