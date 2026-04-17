import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      {/* Logo / Title */}
      <div className="navbar-brand">
        <h2>🎓 Feedback GenAI</h2>
      </div>

      {/* Navigation Links */}
      <nav className="navbar-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/semester-feedback"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Feedback
        </NavLink>

        <NavLink
          to="/subject-analysis"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Analysis
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;