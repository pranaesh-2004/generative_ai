import json
import re
from groq import Groq
from config import Config

client = Groq(api_key=Config.GROQ_API_KEY)


def extract_json_from_text(text):
    """
    Extract JSON object even if wrapped in markdown like ```json ... ```
    """
    text = text.strip()

    # Remove markdown code fences if present
    text = re.sub(r"^```json", "", text, flags=re.IGNORECASE).strip()
    text = re.sub(r"^```", "", text).strip()
    text = re.sub(r"```$", "", text).strip()

    # Extract first JSON object
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        return match.group(0)

    return text


def generate_subject_suggestions(subject, comments):
    joined_feedback = "\n".join([f"- {comment}" for comment in comments])

    prompt = f"""
You are an academic feedback analyst.

Analyze the following student feedback comments for the subject: {subject}.

Feedback comments:
{joined_feedback}

Return ONLY valid JSON in this exact format:
{{
  "summary": "short subject-wise summary",
  "common_issues": ["issue 1", "issue 2"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}}

Do not add explanation.
Do not use markdown.
Do not use triple backticks.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )

    content = response.choices[0].message.content.strip()

    try:
        cleaned = extract_json_from_text(content)
        return json.loads(cleaned)
    except Exception:
        return {
            "summary": content,
            "common_issues": [],
            "suggestions": []
        }