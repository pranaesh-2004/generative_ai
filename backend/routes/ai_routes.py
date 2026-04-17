from flask import Blueprint, jsonify
from datetime import datetime

from database.mongo import feedback_collection, subject_report_collection
from ai.groq_suggestions import generate_subject_suggestions

ai_bp = Blueprint("ai_bp", __name__)


@ai_bp.route("/ai/subject-summary/<int:semester>/<subject>", methods=["GET"])
def get_subject_summary(semester, subject):
    try:
        feedbacks = list(feedback_collection.find({
            "semester": semester,
            "subject": subject
        }))

        if not feedbacks:
            return jsonify({"message": "No feedback found for this subject"}), 404

        comments = [fb["comment"] for fb in feedbacks if fb.get("comment")]

        result = generate_subject_suggestions(subject, comments)

        report_doc = {
            "semester": semester,
            "subject": subject,
            "summary": result.get("summary", ""),
            "common_issues": result.get("common_issues", []),
            "suggestions": result.get("suggestions", []),
            "generated_at": datetime.utcnow()
        }

        subject_report_collection.insert_one(report_doc)

        report_doc.pop("_id", None)
        return jsonify(report_doc), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500