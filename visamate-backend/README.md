# VisaMate Backend

Backend service for **VisaMate**, an AI-powered visa and immigration assistance platform.  
This backend provides the API layer, business logic, document/policy handling, and retrieval support for the VisaMate application.

## Features

- FastAPI-based backend
- REST API endpoints for frontend integration
- Modular project structure with routers, services, schemas, and utils
- Policy/document seed data support
- Chroma vector database integration for retrieval
- Test support included
- Easy local development with `uvicorn`

---

## Tech Stack

- **Python**
- **FastAPI**
- **Uvicorn**
- **ChromaDB**
- **Pytest**
- **Pydantic**

---

## Project Structure

```bash
visamate-backend/
│
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── db.py                # Database / storage setup
│   ├── deps.py              # Dependency injection helpers
│   ├── models/              # Data models
│   ├── routers/             # API route definitions
│   ├── schemas/             # Request/response schemas
│   ├── services/            # Core business logic
│   ├── tests/               # Test cases
│   └── utils/               # Utility/helper functions
│
├── data/
│   └── seed/
│       └── policies.json    # Seed policy data
│
├── load_test_data.py        # Script to load seed/test data
├── requirements.txt         # Python dependencies
├── run.sh                   # Helper script to run the backend
└── README.md



````


---

##  Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd visamate-backend
```
### 2. Create and activate a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate
```
### 3. Install dependencies
```bash
pip install -r requirements.txt
````
---

## Running the Backend

### Start the FastAPI server locally using Uvicorn:
```bash
uvicorn app.main:app --reload
```
If your application runs on a different host/port:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Once started, the backend will be available at:
```bash
http://127.0.0.1:8000
```
---

## API Documentation

FastAPI automatically generates interactive API docs.

After starting the server, open:

- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

  
  ---

## Loading Seed / Test Data

To populate the backend with initial data:
```bash
python load_test_data.py
```
This loads data from:

data/seed/policies.json


---

##  Running Tests

Run all tests using:
```bash
pytest
```

---
### Notes on Chroma / Vector Database

This project uses Chroma-based vector storage for retrieval.

Generated files such as:

- chroma_db/
- chroma_storage/
  
These are not committed to the repository because they are generated locally.
