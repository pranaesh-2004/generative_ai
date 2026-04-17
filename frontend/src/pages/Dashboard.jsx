import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getSemesterFeedback } from "../services/api";
import SemesterSelector from "../components/selectors/SemesterSelector";
import StatsCard from "../components/cards/StatsCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import SentimentChart from "../components/charts/SentimentChart";
import SubjectBarChart from "../components/charts/SubjectBarChart";
import { getSubjectAnalytics, getFacultyAnalytics } from "../utils/helpers";

function Dashboard() {
  const [semester, setSemester] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dashboardRef = useRef(null);

  useEffect(() => {
    if (!semester) {
      setFeedbacks([]);
      return;
    }

    const fetchSemesterFeedback = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getSemesterFeedback(semester);
        setFeedbacks(response.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load semester feedback.");
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSemesterFeedback();
  }, [semester]);

  const stats = useMemo(() => {
    const totalFeedback = feedbacks.length;

    const positiveCount = feedbacks.filter(
      (item) => item.sentiment === "POSITIVE"
    ).length;

    const negativeCount = feedbacks.filter(
      (item) => item.sentiment === "NEGATIVE"
    ).length;

    const neutralCount = feedbacks.filter(
      (item) =>
        item.sentiment !== "POSITIVE" &&
        item.sentiment !== "NEGATIVE"
    ).length;

    const uniqueSubjects = new Set(
      feedbacks.map((item) => item.subject)
    ).size;

    const subjectMap = {};
    feedbacks.forEach((item) => {
      const key = item.subject || "Unknown";
      subjectMap[key] = (subjectMap[key] || 0) + 1;
    });

    const sortedSubjects = Object.entries(subjectMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return {
      totalFeedback,
      positiveCount,
      negativeCount,
      neutralCount,
      uniqueSubjects,
      topSubjects: sortedSubjects.map((entry) => entry[0]),
      topCounts: sortedSubjects.map((entry) => entry[1]),
    };
  }, [feedbacks]);

  const advancedStats = useMemo(() => {
    const subjectMap = getSubjectAnalytics(feedbacks);

    const subjectArray = Object.entries(subjectMap).map(
      ([subject, data]) => ({
        subject,
        ...data,
        negativeRatio: data.total ? data.negative / data.total : 0,
        positiveRatio: data.total ? data.positive / data.total : 0,
      })
    );

    const topNegative = [...subjectArray]
      .sort((a, b) => b.negativeRatio - a.negativeRatio)
      .slice(0, 5);

    const topPositive = [...subjectArray]
      .sort((a, b) => b.positiveRatio - a.positiveRatio)
      .slice(0, 5);

    return { topNegative, topPositive };
  }, [feedbacks]);

  const facultyStats = useMemo(() => {
    const facultyMap = getFacultyAnalytics(feedbacks);

    const facultyArray = Object.entries(facultyMap).map(
      ([faculty, data]) => ({
        faculty,
        ...data,
        negativeRatio: data.total ? data.negative / data.total : 0,
        positiveRatio: data.total ? data.positive / data.total : 0,
      })
    );

    const topPositiveFaculty = [...facultyArray]
      .sort((a, b) => b.positiveRatio - a.positiveRatio)
      .slice(0, 5);

    const topNegativeFaculty = [...facultyArray]
      .sort((a, b) => b.negativeRatio - a.negativeRatio)
      .slice(0, 5);

    return { topPositiveFaculty, topNegativeFaculty };
  }, [feedbacks]);

  const handleExportDashboardPDF = async () => {
    if (!dashboardRef.current || !semester) return;

    const canvas = await html2canvas(dashboardRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 20;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;
    }

    pdf.save(`Semester_${semester}_Dashboard_Report.pdf`);
  };

  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>Semester Dashboard</h1>
        <p>
          Select a semester to view feedback volume, sentiment distribution,
          subject trends, and faculty-wise analytics.
        </p>
      </div>

      <div className="control-panel">
        <SemesterSelector value={semester} onChange={setSemester} />
      </div>

      {!semester && (
        <EmptyState message="Please select a semester to view dashboard analytics." />
      )}

      {loading && <LoadingSpinner text="Loading dashboard data..." />}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && semester && feedbacks.length > 0 && (
        <>
          <div className="export-bar">
            <button
              className="export-button"
              onClick={handleExportDashboardPDF}
            >
              Export Dashboard PDF
            </button>
          </div>

          <div ref={dashboardRef}>
            <div className="stats-grid">
              <StatsCard title="Total Feedback" value={stats.totalFeedback} />
              <StatsCard title="Positive Feedback" value={stats.positiveCount} />
              <StatsCard title="Negative Feedback" value={stats.negativeCount} />
              <StatsCard title="Unique Subjects" value={stats.uniqueSubjects} />
            </div>

            <div className="charts-grid">
              <SentimentChart
                positive={stats.positiveCount}
                negative={stats.negativeCount}
                neutral={stats.neutralCount}
              />
              <SubjectBarChart
                subjects={stats.topSubjects}
                counts={stats.topCounts}
              />
            </div>

            <div className="analytics-section">
              <div className="analytics-card">
                <h3>Top Negative Subjects</h3>
                <ul>
                  {advancedStats.topNegative.map((item, index) => (
                    <li key={index}>
                      {item.subject} ({item.negative}/{item.total})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="analytics-card">
                <h3>Top Positive Subjects</h3>
                <ul>
                  {advancedStats.topPositive.map((item, index) => (
                    <li key={index}>
                      {item.subject} ({item.positive}/{item.total})
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="analytics-section">
              <div className="analytics-card">
                <h3>Top Positive Faculty</h3>
                <ul>
                  {facultyStats.topPositiveFaculty.map((item, index) => (
                    <li key={index}>
                      <strong>{item.faculty}</strong> ({item.positive}/{item.total})
                      <br />
                      <span className="mini-text">
                        Subjects: {item.subjects.join(", ") || "N/A"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="analytics-card">
                <h3>Top Negative Faculty</h3>
                <ul>
                  {facultyStats.topNegativeFaculty.map((item, index) => (
                    <li key={index}>
                      <strong>{item.faculty}</strong> ({item.negative}/{item.total})
                      <br />
                      <span className="mini-text">
                        Subjects: {item.subjects.join(", ") || "N/A"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="dashboard-table-card">
              <h3>Recent Feedback Overview</h3>
              <div className="table-wrapper">
                <table className="feedback-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Faculty</th>
                      <th>Sentiment</th>
                      <th>Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbacks.slice(0, 12).map((item, index) => (
                      <tr key={`${item.subject}-${index}`}>
                        <td>{item.subject}</td>
                        <td>{item.faculty || "N/A"}</td>
                        <td>{item.sentiment}</td>
                        <td>{item.confidence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {!loading && !error && semester && feedbacks.length === 0 && (
        <EmptyState message="No feedback records found for the selected semester." />
      )}
    </div>
  );
}

export default Dashboard;