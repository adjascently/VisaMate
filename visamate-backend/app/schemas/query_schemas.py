from pydantic import BaseModel, Field
from typing import List

class QueryRequest(BaseModel):
    query: str = Field(..., min_length=3, description="User's visa/policy question")

class QueryResponse(BaseModel):
    answer: str
    sources: List[str]
    confidence: float = Field(ge=0.0, le=1.0)
