import feedparser
import traceback
from app.services.embeddings import get_embedding
from app.services.retriever import add_documents
from app.services.db import db

# === 📰 Official Feed Sources ===
USCIS_FEED_URL = "https://www.uscis.gov/news/rss-feed/59144"

# === ✅ Visa-related focus keywords ===
INCLUDE_KEYWORDS = {
    "OPT": [
        "optional practical training",
        "opt",
        "work authorization",
        "employment authorization",
        "ead card",
        "opt application",
        "opt extension",
    ],
    "STEM OPT": [
        "stem opt",
        "stem extension",
        "stem degree",
        "stem field",
        "24-month extension",
        "form i-983",
    ],
    "CPT": [
        "curricular practical training",
        "cpt",
        "internship authorization",
        "coursework training",
        "experiential learning",
        "co-op",
    ],
    "H-1B": [
        "h-1b",
        "h1b",
        "lottery",
        "cap",
        "petition",
        "visa registration",
        "h1b selection",
        "employer sponsorship",
    ],
    "F-1": [
        "f-1",
        "f1",
        "international student",
        "sevp",
        "sevis",
        "student visa",
        "form i-20",
        "i-20",
        "dso",
    ],
    "Travel & Policy": [
        "travel signature",
        "visa interview",
        "us embassy",
        "consulate",
        "status update",
        "uscis policy update",
        "fee change",
        "processing time",
        "rulemaking",
        "reform",
    ],
}

# === 🚫 Exclusion keywords (to remove irrelevant/criminal news) ===
EXCLUDE_KEYWORDS = [
    "fraud", "arrest", "guilty", "sentenced", "molester", "trafficking",
    "indicted", "prosecution", "plead", "violence", "crime", "smuggling",
    "denaturalization", "terrorism", "sex offender", "human rights abuse",
    "child exploitation", "homicide", "conspiracy", "investigation",
    "law enforcement", "criminal", "prison", "conviction", "plea deal",
]


# === Category Helper ===
def categorize(title: str, summary: str) -> str | None:
    """Return a category name based on matching visa-related keywords."""
    text = f"{title.lower()} {summary.lower()}"
    for category, kws in INCLUDE_KEYWORDS.items():
        if any(kw in text for kw in kws):
            return category.title()
    return None


# === Main MCP Function ===
def store_new_docs():
    """Fetch USCIS RSS feed → filter → categorize → embed → store in Chroma + MongoDB."""
    print("\n🔄 [MCP] Fetching latest USCIS updates...")

    try:
        feed = feedparser.parse(USCIS_FEED_URL)
        if not feed.entries:
            print("⚠️ [MCP] No entries found in USCIS feed.")
            return

        docs, ids, metas = [], [], []
        filtered = 0
        seen_links = set()

        for i, entry in enumerate(feed.entries[:50]):  # Fetch top 50 latest
            title = entry.title.strip()
            summary = getattr(entry, "summary", "").strip()
            link = entry.link.strip()
            text = f"{title.lower()} {summary.lower()}"

            # 🚫 Skip duplicates or irrelevant topics
            if link in seen_links or any(ex in text for ex in EXCLUDE_KEYWORDS):
                continue

            seen_links.add(link)

            # ✅ Categorize based on keywords
            category = categorize(title, summary)
            if not category:
                continue

            filtered += 1

            # 🧠 Save clean record to MongoDB (feeds collection)
            db.feeds.update_one(
                {"link": link},
                {"$set": {
                    "title": title,
                    "summary": summary,
                    "link": link,
                    "category": category,
                }},
                upsert=True
            )

            # 🧩 Prepare for embedding + Chroma vector store
            content = f"[{category}] {title}\n\n{summary}"
            docs.append(content)
            ids.append(f"uscis_{i}")
            metas.append({
                "source": "USCIS Feed",
                "title": title,
                "link": link,
                "category": category
            })

            print(f"📰 Added → {title}  🏷️ {category}")

        # === Embed and store in Chroma ===
        if docs:
            print(f"⚙️ [MCP] Embedding and storing {len(docs)} visa-related docs...")
            add_documents(docs, ids, metas)
            print(f"✅ [MCP] Successfully ingested {len(docs)} categorized updates.")
        else:
            print("ℹ️ [MCP] No relevant visa-related documents found.")

        print(f"🗞️ [MCP] Filtered {filtered} relevant entries from feed.\n")

    except Exception:
        print("❌ [MCP] Error during feed ingestion:")
        traceback.print_exc()


# === Compatibility Alias ===
def fetch_and_ingest_latest_updates():
    """Legacy alias for backward compatibility."""
    store_new_docs()
