import { useEffect, useMemo, useState } from "react";
import { getSemesterFeedback } from "../services/api";
import SemesterSelector from "../components/selectors/SemesterSelector";
import SubjectSelector from "../components/selectors/SubjectSelector";
import SearchBox from "../components/common/SearchBox";
import SortSelector from "../components/common/SortSelector";
import FeedbackCard from "../components/cards/FeedbackCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";

function SemesterFeedback() {
  const [semester, setSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!semester) {
      setFeedbacks([]);
      setSelectedSubject("");
      setSearchTerm("");
      setSortBy("");
      return;
    }

    const fetchFeedbacks = async () => {
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

    fetchFeedbacks();
  }, [semester]);

  const subjects = useMemo(() => {
    return [...new Set(feedbacks.map((item) => item.subject).filter(Boolean))].sort();
  }, [feedbacks]);

  const filteredFeedbacks = useMemo(() => {
    let result = [...feedbacks];

    // Filter by subject
    if (selectedSubject) {
      result = result.filter((item) => item.subject === selectedSubject);
    }

    // Search filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          (item.subject || "").toLowerCase().includes(query) ||
          (item.faculty || "").toLowerCase().includes(query) ||
          (item.comment || "").toLowerCase().includes(query) ||
          (item.sentiment || "").toLowerCase().includes(query)
      );
    }

    // Sorting logic
    if (sortBy === "sentiment") {
      result.sort((a, b) =>
        (a.sentiment || "").localeCompare(b.sentiment || "")
      );
    }

    if (sortBy === "confidence") {
      result.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
    }

    if (sortBy === "subject") {
      result.sort((a, b) =>
        (a.subject || "").localeCompare(b.subject || "")
      );
    }

    return result;
  }, [feedbacks, selectedSubject, searchTerm, sortBy]);

  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>Semester Feedback</h1>
        <p>
          Select a semester, filter by subject, search, and sort feedback
          comments with sentiment analysis.
        </p>
      </div>

      <div className="control-panel control-grid">
        <SemesterSelector value={semester} onChange={setSemester} />

        <SubjectSelector
          value={selectedSubject}
          onChange={setSelectedSubject}
          subjects={subjects}
        />

        <SearchBox
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by subject, faculty, comment, or sentiment"
        />

        <SortSelector value={sortBy} onChange={setSortBy} />
      </div>

      {!semester && (
        <EmptyState message="Please select a semester to view feedback records." />
      )}

      {loading && <LoadingSpinner text="Loading semester feedback..." />}

      {error && <ErrorMessage message={error} />}

      {!loading && !error && semester && filteredFeedbacks.length > 0 && (
        <div className="feedback-grid">
          {filteredFeedbacks.map((feedback, index) => (
            <FeedbackCard
              key={`${feedback.subject}-${index}`}
              feedback={feedback}
            />
          ))}
        </div>
      )}

      {!loading && !error && semester && filteredFeedbacks.length === 0 && (
        <EmptyState message="No feedback found for the selected filters." />
      )}
    </div>
  );
}

export default SemesterFeedback;