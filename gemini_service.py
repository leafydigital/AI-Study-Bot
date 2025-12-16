import google.generativeai as genai
import google.api_core.exceptions as gexc

# Hardcode for now (safe for college demo)
genai.configure(api_key="AIzaSyDdruCqC2vwoS0g0GFno8VazT2mePUHpA4")

CACHE = {}

def get_academic_answer(question):
    if question in CACHE:
        return CACHE[question]

    model = genai.GenerativeModel("models/gemini-2.5-flash-lite")

    prompt = f"""
    You are an academic assistant.

    Answer ONLY educational or study-related questions.

    If the question is non-academic or sensitive,
    respond exactly:
    "This content is restricted for academic learning."

    Question: {question}
    """

    try:
        response = model.generate_content(prompt)
        CACHE[question] = response.text
        return response.text
    except gexc.ResourceExhausted:
        return "⚠️ API quota exceeded. Please try again later."
