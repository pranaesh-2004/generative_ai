from flask import Flask
from flask_cors import CORS

from routes.feedback_routes import feedback_bp
from routes.ai_routes import ai_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(feedback_bp)
app.register_blueprint(ai_bp)

@app.route("/", methods=["GET"])
def home():
    return {"message": "Student Feedback GenAI Backend Running"}

if __name__ == "__main__":
    app.run(debug=True)