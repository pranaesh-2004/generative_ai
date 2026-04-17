function SentimentBadge({ sentiment }) {
  const normalized = (sentiment || "").toUpperCase();

  let badgeClass = "sentiment-badge neutral";

  if (normalized === "POSITIVE") {
    badgeClass = "sentiment-badge positive";
  } else if (normalized === "NEGATIVE") {
    badgeClass = "sentiment-badge negative";
  }

  return <span className={badgeClass}>{normalized || "UNKNOWN"}</span>;
}

export default SentimentBadge;