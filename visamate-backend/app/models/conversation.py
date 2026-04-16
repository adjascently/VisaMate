# app/models/conversation.py
from enum import Enum
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class MsgRole(str, Enum):
    assistant = "assistant"
    user = "user"

class UIElement(BaseModel):
    type: str                   # "options" | "upload" | "note"
    label: Optional[str] = None
    options: Optional[List[str]] = None  # for buttons
    accept: Optional[List[str]] = None   # for uploads (["image/*","application/pdf"])

class Message(BaseModel):
    role: MsgRole
    content: str
    ui: Optional[List[UIElement]] = None

class ConversationState(BaseModel):
    stage: str
    data: Dict[str, Any] = {}
    history: List[Message] = []
