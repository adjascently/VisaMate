"""
app/services/retriever.py
----------------------------------
Handles document storage and retrieval for VisaMate RAG pipeline.
NOW USING PERSISTENT CHROMA (duckdb+parquet) — no more resets.
"""

import chromadb
from chromadb.config import Settings
from app.services.embeddings import get_embedding, get_embeddings_batch


# ======================================
# 1️⃣  Initialize Persistent Chroma Client
# ======================================
def get_chroma_client():
    """
    Initialize a persistent Chroma client.
    Data is stored in ./chroma_storage and survives server restarts.
    """
    client = chromadb.Client(
        Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory="./chroma_storage",
            anonymized_telemetry=False
        )
    )
    print("💾 Using PERSISTENT Chroma client — DB saved to ./chroma_storage")
    return client


client = get_chroma_client()


# ======================================
# 2️⃣  Create or Retrieve Collection
# ======================================
def get_collection(force_recreate: bool = False):
    """
    Get or create the USCIS collection.
    Uses persistent Chroma storage.
    """
    collection_name = "uscis_docs"

    if force_recreate:
        try:
            client.delete_collection(collection_name)
            print("🧹 Old collection deleted (forced recreate)")
        except Exception as e:
            print(f"⚠️ No existing collection to delete: {e}")

    try:
        collection = client.get_collection(name=collection_name)
        print(f"✅ Using existing collection: {collection_name}")
    except Exception:
        print(f"📦 Creating new collection: {collection_name}")
        collection = client.create_collection(name=collection_name)
        print("✅ New collection created successfully.")

    return collection


collection = get_collection(force_recreate=False)


# ======================================
# 3️⃣  Reset Collection (only when needed)
# ======================================
def reset_collection():
    """Force reset the USCIS document collection."""
    global collection
    collection = get_collection(force_recreate=True)
    print("✅ Collection has been reset.")
    return collection


# ======================================
# 4️⃣  Add Documents to Chroma
# ======================================
def add_documents(docs, ids, metadatas=None):
    """
    Add documents + metadata to Chroma.
    Called by MCP updater after downloading USCIS/SEVP text.
    """
    if not docs:
        print("⚠️ No documents to add.")
        return

    if metadatas is None:
        metadatas = [{"source": f"uscis_{i}"} for i in range(len(docs))]

    embeddings = get_embeddings_batch(docs)
    collection.add(
        documents=docs,
        ids=ids,
        embeddings=embeddings,
        metadatas=metadatas
    )

    print(f"✅ Added {len(docs)} docs to Chroma (persistent).")


# ======================================
# 5️⃣  Retrieve Documents (RAG)
# ======================================
def retrieve_relevant_docs(query: str, k: int = 3, metadata_filter: dict = None):
    """
    Retrieve top-k most relevant documents using vector similarity.
    Optional metadata_filter = {"visa_stage": "..."}.
    """
    try:
        query_embedding = get_embedding(query)

        query_params = {
            "query_embeddings": [query_embedding],
            "n_results": k
        }

        if metadata_filter:
            query_params["where"] = metadata_filter

        results = collection.query(**query_params)

        docs = []
        for i, doc in enumerate(results["documents"][0]):
            meta = results.get("metadatas", [{}])[0][i]
            docs.append(
                {
                    "content": doc,
                    "source": meta.get("source", f"uscis_{i}"),
                    "category": meta.get("category", "Unknown"),
                    "score": results.get("distances", [[None]])[0][i],
                }
            )

        print(f"🔎 Retrieved {len(docs)} relevant docs for query: '{query}'")
        return docs

    except Exception as e:
        print(f"❌ Error during retrieval: {e}")
        print("💡 Hint: If you see a dimension mismatch, run reset_collection().")
        return []
