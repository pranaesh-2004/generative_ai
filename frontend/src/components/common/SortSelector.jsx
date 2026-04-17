function SortSelector({ value, onChange }) {
  return (
    <div className="selector-group">
      <label htmlFor="sort">Sort By</label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Default</option>
        <option value="sentiment">Sentiment</option>
        <option value="confidence">Confidence</option>
        <option value="subject">Subject</option>
      </select>
    </div>
  );
}

export default SortSelector;