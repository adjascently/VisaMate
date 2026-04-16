import os
import openai

client = openaiapi_key=os.getenv("OPENAI_API_KEY")

def generate_answer(query: str, context: str):
    """
    Use GPT-4o to synthesize an immigration-compliant answer.
    """
    messages = [
        {"role": "system", "content": "You are VisaMate, a verified immigration assistant using USCIS and SEVP policy data."},
        {"role": "user", "content": f"Context:\n{context}\n\nQuestion:\n{query}"}
    ]
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.2
    )
    return resp.choices[0].message.content.strip()
