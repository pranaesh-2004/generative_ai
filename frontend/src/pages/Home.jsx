import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page-container">
      <section className="hero-section home-hero">
        <div className="hero-badge">AI-Powered Academic Feedback Platform</div>
        <h1>GenAI-Powered Student Feedback Analysis System</h1>
        <p>
          Collect student feedback, analyze sentiment using AI, generate
          subject-wise summaries, and provide faculty-focused improvement
          insights through an intelligent academic dashboard.
        </p>

        <div className="hero-actions">
          <Link to="/dashboard" className="card-button">
            Open Dashboard
          </Link>
          
        </div>
      </section>

      <section className="stats-strip">
        <div className="home-stat-card">
          <h3>2</h3>
          <p>Semesters Covered</p>
        </div>
        <div className="home-stat-card">
          <h3>AI</h3>
          <p>Sentiment + Summary</p>
        </div>
        <div className="home-stat-card">
          
          <p>Instant Feedback Analysis</p>
        </div>
        
      </section>

      <section className="home-card-grid">
        <div className="home-card enhanced-card">
          <div className="card-icon">📊</div>
          <h3>Dashboard</h3>
          <p>
            View semester-level feedback statistics, sentiment distribution,
            subject analytics, faculty insights, and AI-powered academic trends.
          </p>
          <ul className="feature-list">
            <li>Semester-wise analytics</li>
            <li>Faculty performance insights</li>
            <li>Exportable dashboard report</li>
          </ul>
          <Link to="/dashboard" className="card-button">
            Open Dashboard
          </Link>
        </div>

        <div className="home-card enhanced-card">
          <div className="card-icon">📝</div>
          <h3>Semester Feedback</h3>
          <p>
            Explore semester-wise feedback records with filtering, search,
            sentiment analysis, and organized subject-level view.
          </p>
          <ul className="feature-list">
            <li>Search and sort feedback</li>
            <li>Filter by subject</li>
            <li>View sentiment confidence</li>
          </ul>
          <Link to="/semester-feedback" className="card-button">
            View Feedback
          </Link>
        </div>

        <div className="home-card enhanced-card">
          <div className="card-icon">🧠</div>
          <h3>Subject Analysis</h3>
          <p>
            Generate AI summaries, identify common issues, and provide
            suggestions for improvement at the subject level.
          </p>
          <ul className="feature-list">
            <li>AI-generated summaries</li>
            <li>Common issue detection</li>
            <li>Faculty suggestions</li>
          </ul>
          <Link to="/subject-analysis" className="card-button">
            Analyze Subject
          </Link>
        </div>
      </section>

      <section className="tech-section">
        <div className="tech-header">
          <h2>Core Project Capabilities</h2>
          <p>
            Built to support modern academic feedback collection, analysis, and
            decision-making.
          </p>
        </div>

        <div className="tech-grid">
          <div className="tech-card">
            <h4>DistilBERT Sentiment Analysis</h4>
            <p>
              Automatically classifies student feedback sentiment for quick
              interpretation and analytics.
            </p>
          </div>

          <div className="tech-card">
            <h4>Groq AI Insights</h4>
            <p>
              Generates subject-level and semester-level summaries, common
              issues, and improvement suggestions.
            </p>
          </div>

          <div className="tech-card">
            <h4>Faculty-Focused View</h4>
            <p>
              Enables faculty members to review feedback relevant to their own
              subjects and performance.
            </p>
          </div>

          <div className="tech-card">
            <h4>Interactive Dashboard</h4>
            <p>
              Visual charts, analytics, ranking, and exportable reports help
              present feedback in a decision-friendly way.
            </p>
          </div>
        </div>
      </section>

      
    </div>
  );
}

export default Home;