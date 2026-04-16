# app/services/sessions.py
from typing import Dict
from app.models.conversation import ConversationState

_sessions: Dict[str, ConversationState] = {}

def get_session(user_id: str) -> ConversationState:
    if user_id not in _sessions:
        _sessions[user_id] = ConversationState(stage="onboard::greet", data={}, history=[])
    return _sessions[user_id]

def save_session(user_id: str, state: ConversationState):
    _sessions[user_id] = state
