function SemesterSelector({ value, onChange }) {
  return (
    <div className="selector-group">
      <label htmlFor="semester">Select Semester</label>
      <select
        id="semester"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Choose Semester</option>
        <option value="4">Semester 4</option>
        <option value="8">Semester 8</option>
      </select>
    </div>
  );
}

export default SemesterSelector;