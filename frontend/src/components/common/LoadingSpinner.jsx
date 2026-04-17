function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
}

export default LoadingSpinner;