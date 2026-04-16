"""
RAG Service
------------
Handles retrieval of relevant visa-related documents from ChromaDB (or a fallback
in-memory store). Supports metadata filtering (e.g., by visa_stage).
"""

from typing import List, Dict, Optional
import chromadb
from chromadb.utils import embedding_functions
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# ==========================
# 🔹 Setup ChromaDB Client
# ==========================
client = chromadb.PersistentClient(path="data/chroma")
collection_name = "uscis_policies"

# Try to load existing collection or create it
try:
    collection = client.get_or_create_collection(
        name=collection_name,
        metadata={"description": "USCIS & SEVP policy documents"}
    )
except Exception as e:
    print(f"⚠️ Chroma initialization failed: {e}")
    collection = None

# ==========================
# 🔹 Embedding Function
# ==========================
embedding_fn = embedding_functions.OpenAIEmbeddingFunction(
    api_key=os.getenv("OPENAI_API_KEY"),
    model_name="text-embedding-3-small"
)


# ============================================================
# 🔹 Main Retrieval Function
# ============================================================
def retrieve_relevant_docs(
    query: str,
    k: int = 3,
    metadata_filter: Optional[Dict] = None
) -> List[Dict]:
    """
    Retrieve top-k relevant documents from ChromaDB for a given query.
    Optionally filters by metadata (e.g., {"visa_stage": "OPT"}).

    Returns:
        A list of dicts containing: content, source, score, and url.
    """
    if not collection:
        print("⚠️ No Chroma collection initialized; returning mock results.")
        return [
            {
                "content": "Mock policy excerpt about STEM OPT application timelines.",
                "source": "mock_usics_policy.pdf",
                "score": 0.75,
                "url": "https://www.uscis.gov/working-in-the-us/students-and-exchange-visitors/stem-opt"
            }
        ]

    try:
        # Perform similarity search
        results = collection.query(
            query_texts=[query],
            n_results=k,
            where=metadata_filter or {},  # ✅ Metadata filtering support
            include=["documents", "metadatas", "distances"]
        )

        # Format the retrieved results
        docs = []
        for i in range(len(results["documents"][0])):
            docs.append({
                "content": results["documents"][0][i],
                "source": results["metadatas"][0][i].get("source", f"doc_{i+1}.pdf"),
                "score": 1 - float(results["distances"][0][i]),
                "url": results["metadatas"][0][i].get("url", "")
            })

        return docs

    except Exception as e:
        print(f"❌ Retrieval error: {e}")
        return []


# ============================================================
# 🔹 Example Local Test (optional)
# ============================================================
if __name__ == "__main__":
    print("🔍 Testing retrieval...")
    test_docs = retrieve_relevant_docs(
        "When can I apply for STEM OPT?",
        k=2,
        metadata_filter={"visa_stage": "OPT"}
    )
    for d in test_docs:
        print(d)
