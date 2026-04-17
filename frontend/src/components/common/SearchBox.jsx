function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="selector-group">
      <label htmlFor="search-box">Search Feedback</label>
      <input
        id="search-box"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBox;