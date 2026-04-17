export function getSentimentStats(feedbacks) {
  const stats = {
    positive: 0,
    negative: 0,
    neutral: 0,
  };

  feedbacks.forEach((item) => {
    if (item.sentiment === "POSITIVE") stats.positive++;
    else if (item.sentiment === "NEGATIVE") stats.negative++;
    else stats.neutral++;
  });

  return stats;
}

export function getSubjectAnalytics(feedbacks) {
  const subjectMap = {};

  feedbacks.forEach((item) => {
    const subject = item.subject || "Unknown";

    if (!subjectMap[subject]) {
      subjectMap[subject] = {
        total: 0,
        positive: 0,
        negative: 0,
      };
    }

    subjectMap[subject].total++;

    if (item.sentiment === "POSITIVE") subjectMap[subject].positive++;
    if (item.sentiment === "NEGATIVE") subjectMap[subject].negative++;
  });

  return subjectMap;
}

export function getFacultyAnalytics(feedbacks) {
  const facultyMap = {};

  feedbacks.forEach((item) => {
    const faculty = item.faculty && item.faculty.trim() ? item.faculty : "Unknown Faculty";

    if (!facultyMap[faculty]) {
      facultyMap[faculty] = {
        total: 0,
        positive: 0,
        negative: 0,
        subjects: new Set(),
      };
    }

    facultyMap[faculty].total++;

    if (item.sentiment === "POSITIVE") facultyMap[faculty].positive++;
    if (item.sentiment === "NEGATIVE") facultyMap[faculty].negative++;

    if (item.subject) {
      facultyMap[faculty].subjects.add(item.subject);
    }
  });

  return Object.fromEntries(
    Object.entries(facultyMap).map(([faculty, data]) => [
      faculty,
      {
        ...data,
        subjects: Array.from(data.subjects),
      },
    ])
  );
}