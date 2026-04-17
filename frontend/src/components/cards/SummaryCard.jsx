function SummaryCard({ summary }) {
  return (
    <div className="summary-card">
      <h3>AI Summary</h3>
      <p>{summary || "No summary available."}</p>
    </div>
  );
}

export default SummaryCard;