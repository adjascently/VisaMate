# app/utils/similarity.py
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compute_similarity(a, b):
    """Compute cosine similarity between two text answers."""
    vectorizer = TfidfVectorizer().fit([a, b])
    vectors = vectorizer.transform([a, b])
    return float(cosine_similarity(vectors[0], vectors[1])[0][0])
