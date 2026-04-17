from flask import Blueprint, jsonify
from database.mongo import feedback_collection

feedback_bp = Blueprint("feedback_bp", __name__)

@feedback_bp.route("/feedback/all", methods=["GET"])
def get_all_feedback():
    try:
        feedbacks = list(feedback_collection.find({}, {"_id": 0}))
        return jsonify(feedbacks), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@feedback_bp.route("/feedback/semester/<int:semester>", methods=["GET"])
def get_feedback_by_semester(semester):
    try:
        feedbacks = list(feedback_collection.find({"semester": semester}, {"_id": 0}))
        return jsonify(feedbacks), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@feedback_bp.route("/feedback/subject/<int:semester>/<subject>", methods=["GET"])
def get_feedback_by_subject(semester, subject):
    try:
        feedbacks = list(
            feedback_collection.find(
                {"semester": semester, "subject": subject},
                {"_id": 0}
            )
        )
        return jsonify(feedbacks), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500