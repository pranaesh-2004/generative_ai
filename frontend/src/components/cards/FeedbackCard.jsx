import SentimentBadge from "./SentimentBadge";

function FeedbackCard({ feedback }) {
  return (
    <div className="feedback-card">
      <div className="feedback-card-header">
        <div>
          <h3>{feedback.subject}</h3>
          <p className="feedback-meta">
            Faculty: {feedback.faculty || "N/A"} | Semester: {feedback.semester}
          </p>
        </div>

        <SentimentBadge sentiment={feedback.sentiment} />
      </div>

      <p className="feedback-comment">{feedback.comment}</p>

      <div className="feedback-footer">
        <span>Confidence: {feedback.confidence ?? "N/A"}</span>
        <span>Code: {feedback.subject_code || "N/A"}</span>
      </div>
    </div>
  );
}

export default FeedbackCard;