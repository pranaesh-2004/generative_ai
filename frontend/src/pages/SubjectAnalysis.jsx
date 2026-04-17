import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  getSemesterFeedback,
  getSubjectFeedback,
  getSubjectSummary,
} from "../services/api";
import SemesterSelector from "../components/selectors/SemesterSelector";
import SubjectSelector from "../components/selectors/SubjectSelector";
import FeedbackCard from "../components/cards/FeedbackCard";
import SummaryCard from "../components/cards/SummaryCard";
import SuggestionCard from "../components/cards/SuggestionCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";

function SubjectAnalysis() {
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [semesterFeedbacks, setSemesterFeedbacks] = useState([]);
  const [subjectFeedbacks, setSubjectFeedbacks] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState("");

  const reportRef = useRef(null);

  useEffect(() => {
    if (!semester) {
      setSemesterFeedbacks([]);
      setSubject("");
      setSubjectFeedbacks([]);
      setSummaryData(null);
      return;
    }

    const fetchSemesterData = async () => {
      try {
        setLoadingSubjects(true);
        setError("");

        const response = await getSemesterFeedback(semester);
        setSemesterFeedbacks(response.data || []);
        setSubject("");
        setSubjectFeedbacks([]);
        setSummaryData(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load semester subjects.");
        setSemesterFeedbacks([]);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSemesterData();
  }, [semester]);

  useEffect(() => {
    if (!semester || !subject) {
      setSubjectFeedbacks([]);
      setSummaryData(null);
      return;
    }

    const fetchSubjectAnalysis = async () => {
      try {
        setLoadingAnalysis(true);
        setError("");

        const [feedbackResponse, summaryResponse] = await Promise.all([
          getSubjectFeedback(semester, subject),
          getSubjectSummary(semester, subject),
        ]);

        setSubjectFeedbacks(feedbackResponse.data || []);
        setSummaryData(summaryResponse.data || null);
      } catch (err) {
        console.error(err);
        setError("Failed to load subject analysis.");
        setSubjectFeedbacks([]);
        setSummaryData(null);
      } finally {
        setLoadingAnalysis(false);
      }
    };

    fetchSubjectAnalysis();
  }, [semester, subject]);

  const subjects = useMemo(() => {
    return [...new Set(semesterFeedbacks.map((item) => item.subject).filter(Boolean))].sort();
  }, [semesterFeedbacks]);

  const handleExportPDF = async () => {
    if (!reportRef.current || !semester || !subject) return;

    const canvas = await html2canvas(reportRef.current, {
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

    pdf.save(`Subject_Analysis_Sem${semester}_${subject}.pdf`);
  };

  return (
    <div className="page-container">
      <div className="hero-section">
        <h1>Subject Analysis</h1>
        <p>
          Select a semester and subject to view sentiment-tagged feedback,
          AI-generated summary, common issues, and suggestions.
        </p>
      </div>

      <div className="control-panel control-grid">
        <SemesterSelector value={semester} onChange={setSemester} />
        <SubjectSelector value={subject} onChange={setSubject} subjects={subjects} />
      </div>

      {!semester && (
        <EmptyState message="Please select a semester to begin subject analysis." />
      )}

      {loadingSubjects && <LoadingSpinner text="Loading subjects..." />}
      {loadingAnalysis && <LoadingSpinner text="Generating subject analysis..." />}

      {error && <ErrorMessage message={error} />}

      {!loadingAnalysis && !loadingSubjects && semester && subject && summaryData && (
        <>
          <div className="export-bar">
            <button className="export-button" onClick={handleExportPDF}>
              Export PDF Report
            </button>
          </div>

          <div className="analysis-layout" ref={reportRef}>
            <div className="analysis-column">
              <SummaryCard summary={summaryData.summary} />
              <SuggestionCard
                title="Common Issues"
                items={summaryData.common_issues || []}
              />
              <SuggestionCard
                title="Suggestions"
                items={summaryData.suggestions || []}
              />
            </div>

            <div className="analysis-column">
              <div className="summary-card">
                <h3>Feedback Comments</h3>
                <p>
                  <strong>Semester:</strong> {semester} <br />
                  <strong>Subject:</strong> {subject}
                </p>

                {subjectFeedbacks.length === 0 ? (
                  <p>No subject feedback available.</p>
                ) : (
                  <div className="feedback-grid single-column">
                    {subjectFeedbacks.map((feedback, index) => (
                      <FeedbackCard
                        key={`${feedback.subject}-${index}`}
                        feedback={feedback}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {!loadingAnalysis && !loadingSubjects && semester && subject && !summaryData && !error && (
        <EmptyState message="No analysis available for the selected subject." />
      )}
    </div>
  );
}

export default SubjectAnalysis;