"""
app/services/embeddings.py
----------------------------------
Generates text embeddings for RAG retrieval and MCP updates.
Uses OpenAI's text-embedding-ada-002 / 1536 dimensions.
"""

import os
import openai
from dotenv import load_dotenv

# === Load environment variables ===
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


def get_embedding(text: str):
    """
    Generate a single embedding vector using OpenAI's ada-002 model.
    """
    text = text.replace("\n", " ")
    resp = openai.Embedding.create(
        model="text-embedding-ada-002",
        input=text
    )
    return resp["data"][0]["embedding"]


def get_embeddings_batch(texts: list[str]):
    """
    Generate embeddings in batch for MCP/feed ingestion.
    """
    if not texts:
        return []

    cleaned = [t.replace("\n", " ") for t in texts]

    resp = openai.Embedding.create(
        model="text-embedding-ada-002",
        input=cleaned
    )

    return [item["embedding"] for item in resp["data"]]
