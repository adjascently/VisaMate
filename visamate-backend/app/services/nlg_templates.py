from typing import List, Dict

def render_questions(questions: List[str]) -> List[str]:
    # bullet list in one message or separate? Choose short separate messages for chat pacing
    return [f"{q}" for q in questions]

def render_upload_prompt(upload_cfg: Dict) -> str:
    # expects keys like upload_cfg['i20'] = ["Please upload I-20...", ...]
    lines = ["To verify and keep you compliant, please upload the following (PDF or image):"]
    for k, v in upload_cfg.items():
        if isinstance(v, list):
            lines.append(f"• {', '.join(v)}")
        else:
            lines.append(f"• {v}")
    lines.append("You can send each file one at a time. I’ll automatically extract SEVIS ID and key dates.")
    return "\n".join(lines)
