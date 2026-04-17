from transformers import pipeline

sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

def analyze_sentiment(text):
    if not text or not text.strip():
        return {
            "sentiment": "NEUTRAL",
            "confidence": 0.0
        }

    result = sentiment_pipeline(text[:512])[0]

    return {
        "sentiment": result["label"],
        "confidence": round(float(result["score"]), 4)
    }