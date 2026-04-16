"""
USCIS Document Ingestion Script (Python 3.13 Safe Version)
Downloads USCIS policy pages, cleans text, splits into chunks,
and embeds into ChromaDB (persistent).
"""

import requests
from bs4 import BeautifulSoup
from app.services.retriever import add_documents
import time

# USCIS Official Policy Pages
USCIS_SOURCES = [
    {
        "url": "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students",
        "title": "USCIS OPT Policy",
        "topic": "OPT"
    },
    {
        "url": "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/students-and-employment",
        "title": "USCIS Student Employment",
        "topic": "F-1 Employment"
    },
    {
        "url": "https://studyinthestates.dhs.gov/students/employment",
        "title": "Study in the States - Employment",
        "topic": "Student Employment"
    },
    {
        "url": "https://studyinthestates.dhs.gov/students/opt-and-cpt",
        "title": "Study in the States - OPT and CPT",
        "topic": "CPT and OPT"
    }
]


def fetch_page_content(url):
    """Fetch and clean text from a web page."""
    try:
        print(f"🌐 Fetching: {url}")
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Remove unnecessary tags
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()

        text = soup.get_text(separator="\n", strip=True)
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        cleaned = "\n".join(lines)

        print(f"   ✔ Extracted {len(cleaned)} characters")
        return cleaned

    except Exception as e:
        print(f"   ❌ Error fetching {url}: {e}")
        return None


def split_text_simple(text, chunk_size=1200, overlap=200):
    """Simple Python chunking with overlap (no LangChain)."""
    chunks = []
    start = 0
    text_len = len(text)

    while start < text_len:
        end = min(start + chunk_size, text_len)
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap

    print(f"   ✂️  Split into {len(chunks)} chunks")
    return chunks


def ingest_uscis_documents():
    print("\n====================================================")
    print("🚀 Starting USCIS Document Ingestion (Python 3.13 Safe)")
    print("====================================================\n")

    all_chunks = []
    all_ids = []
    all_meta = []

    for idx, src in enumerate(USCIS_SOURCES):
        print(f"📄 Processing: {src['title']}")

        text = fetch_page_content(src["url"])
        if not text:
            continue

        chunks = split_text_simple(text)

        for j, c in enumerate(chunks):
            all_chunks.append(c)
            all_ids.append(f"{src['topic'].lower()}_{idx}_{j}")
            all_meta.append({
                "source": src["title"],
                "url": src["url"],
                "topic": src["topic"],
                "chunk_index": j
            })

        time.sleep(1)

    print(f"\n📦 Total Chunks Collected: {len(all_chunks)}")
    print("🔁 Embedding & inserting into Chroma...\n")

    batch_size = 10
    for i in range(0, len(all_chunks), batch_size):
        batch_docs = all_chunks[i:i+batch_size]
        batch_ids = all_ids[i:i+batch_size]
        batch_meta = all_meta[i:i+batch_size]

        print(f"   Embedding batch {i//batch_size + 1}")
        add_documents(batch_docs, batch_ids, batch_meta)
        time.sleep(1)

    print("\n🎉 DONE — USCIS policy documents successfully ingested!")


if __name__ == "__main__":
    ingest_uscis_documents()
