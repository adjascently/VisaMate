import os
from app.services.retriever import add_documents
from app.services.retriever import collection

BASE = "app/data/documents"

def ingest_local_policy():
    docs = []
    ids = []
    metas = []

    for filename in os.listdir(BASE):
        if not filename.endswith(".txt"):
            continue

        path = os.path.join(BASE, filename)
        topic = filename.replace(".txt", "")

        with open(path, "r") as f:
            text = f.read().strip()

        docs.append(text)
        ids.append(topic)
        metas.append({"source": topic, "category": "policy"})

    print(f"📚 Ingesting {len(docs)} local policy files...")
    add_documents(docs, ids, metas)
    print("✅ Local policy corpus ingested!")
    print("Total docs in DB:", collection.count())

if __name__ == "__main__":
    ingest_local_policy()
