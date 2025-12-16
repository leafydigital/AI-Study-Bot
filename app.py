from flask import Flask, render_template, request, jsonify
from classifier import classify_query
from gemini_service import get_academic_answer

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    question = data["question"].lower()

    category = classify_query(question)

    if category == "sensitive":
        return jsonify({
            "response": "⚠️ This content is restricted for academic learning."
        })

    answer = get_academic_answer(question)

    return jsonify({
        "response": answer
    })

if __name__ == "__main__":
    app.run(debug=True)
