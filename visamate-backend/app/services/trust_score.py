import openai
import os, json

client = openaiapi_key=os.getenv("OPENAI_API_KEY")

def cross_verify(query, answer, context):
    prompt = f"""
    Compare the following answer to the given context.
    Respond in pure JSON only.

    {{
      "trust_score": <float between 0.0 and 1.0>,
      "justification": "<short reason>"
    }}

    Question: {query}
    Answer: {answer}
    Context: {context}
    """

    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1
        )

        content = resp.choices[0].message.content.strip()

        # 🔍 Ensure proper JSON parsing even if model wraps it in ```json ... ```
        if content.startswith("```"):
            content = content.replace("```json", "").replace("```", "").strip()

        parsed = json.loads(content)
        return parsed

    except Exception as e:
        print("⚠️ Trust scoring failed:", e)
        return {"trust_score": None, "justification": "Verification step failed"}
