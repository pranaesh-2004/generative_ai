function SuggestionCard({ title, items = [] }) {
  return (
    <div className="summary-card">
      <h3>{title}</h3>

      {items.length === 0 ? (
        <p>No items available.</p>
      ) : (
        <ul className="suggestion-list">
          {items.map((item, index) => (
            <li key={`${title}-${index}`}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SuggestionCard;