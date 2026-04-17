import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllFeedback = () => API.get("/feedback/all");

export const getSemesterFeedback = (semester) =>
  API.get(`/feedback/semester/${semester}`);

export const getSubjectFeedback = (semester, subject) =>
  API.get(`/feedback/subject/${semester}/${encodeURIComponent(subject)}`);

export const getSubjectSummary = (semester, subject) =>
  API.get(`/ai/subject-summary/${semester}/${encodeURIComponent(subject)}`);

export const getSemesterSummary = (semester) =>
  API.get(`/ai/semester-summary/${semester}`);

export const getFacultyFeedback = (facultyName) =>
  API.get(`/feedback/faculty/${encodeURIComponent(facultyName)}`);

export const submitFeedback = (data) =>
  API.post("/feedback/submit", data);

export default API;