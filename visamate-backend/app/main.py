from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

# === Patch: Safe JSON serialization for ObjectId ===
class SafeJSONResponse(JSONResponse):
    def render(self, content):
        return super().render(
            jsonable_encoder(
                content,
                custom_encoder={ObjectId: str}
            )
        )

# === Import Routers ===
from app.routers import auth, query, upload, news, forum, chat
from app.routers import eval as eval_router    # ⭐ Evaluation endpoint

# === Environment Loader ===
from app.utils.env_loader import load_env
load_env()

# === FastAPI App ===
app = FastAPI(
    title="VisaMate API 🛂",
    version="2.2",
    description="Unified AI assistant backend for CPT, OPT, STEM-OPT, and H-1B guidance.",
    default_response_class=SafeJSONResponse
)

# === CORS Middleware ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Register Routers ===
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(query.router, prefix="/query", tags=["Query"])
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(news.router, prefix="/news", tags=["News"])
app.include_router(forum.router, prefix="/forum", tags=["Forum"])
app.include_router(chat.router, prefix="/chat", tags=["Conversation"])
app.include_router(eval_router.router, prefix="/api", tags=["Evaluation"])    # ⭐ Key line


@app.get("/", tags=["Health"])
def root():
    return {"message": "VisaMate backend is live 🚀", "version": "2.2"}


# ======================================================
# === Startup: MCP + USCIS Policy Document Ingestion ===
# ======================================================

from app.services.mcp_updater import store_new_docs
from app.services.ingest_uscis_docs import ingest_uscis_documents
from app.services.retriever import collection

scheduler = BackgroundScheduler()


@app.on_event("startup")
def startup_ingestion():
    try:
        # 1️⃣ Always run news feed ingestion (cheap + small)
        print("🔄 Running MCP news ingestion...")
        store_new_docs()

        # 2️⃣ Check if policy documents need loading
        doc_count = collection.count()
        print(f"📚 ChromaDB currently has {doc_count} documents.")

        # If collection is empty or unexpectedly tiny → load USCIS policy docs
        if doc_count < 20:
            print("🟡 Policy docs missing — running USCIS policy ingestion...")
            ingest_uscis_documents()
            print("✅ USCIS policy documents ingested.")
        else:
            print("🟢 Policy documents already present — skipping ingestion.")

    except Exception as e:
        print(f"❌ Startup ingestion error: {e}")
