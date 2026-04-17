import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page-container">
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="card-button">
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;