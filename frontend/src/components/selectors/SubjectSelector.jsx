function SubjectSelector({ value, onChange, subjects = [] }) {
  return (
    <div className="selector-group">
      <label htmlFor="subject">Select Subject</label>
      <select
        id="subject"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Choose Subject</option>
        {subjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SubjectSelector;