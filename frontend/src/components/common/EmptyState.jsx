function EmptyState({ message = "No data found." }) {
  return (
    <div className="empty-state">
      <h3>No Results</h3>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;