from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from dataset import data

texts = [q for q, _ in data]
labels = [l for _, l in data]

classifier = Pipeline([
    ("tfidf", TfidfVectorizer(stop_words="english")),
    ("nb", MultinomialNB())
])

classifier.fit(texts, labels)

def classify_query(query):
    query = query.lower().strip()

    # 1️⃣ STRICT BLACKLIST (highest priority)
    blacklist = [
        "hack", "crack", "porn", "adult",
        "weapon", "bomb", "drug", "piracy"
    ]

    for word in blacklist:
        if word in query:
            return "sensitive"

    # 2️⃣ ACADEMIC WHITELIST (override ML)
    academic_keywords = [
        "javascript", "dbms", "ai", "python",
        "java", "c++", "os", "computer networks",
        "data structure", "algorithm"
    ]

    academic_verbs = [
        "explain", "define", "what is",
        "describe", "difference", "example",
        "advantages", "disadvantages"
    ]

    for word in academic_keywords:
        if word in query:
            return "academic"

    for verb in academic_verbs:
        if verb in query:
            return "academic"

    # 3️⃣ ML CLASSIFIER (fallback)
    prediction = classifier.predict([query])[0]
    return prediction
