function ErrorMessage({ message = "Something went wrong." }) {
  return (
    <div className="error-state">
      <h3>Error</h3>
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;