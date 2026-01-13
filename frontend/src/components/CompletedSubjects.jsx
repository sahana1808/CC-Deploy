import React, { useEffect, useState } from "react";

function CompletedSubjects() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/study/completed")
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch(() => console.error("Failed to load completed subjects"));
  }, []);

  return (
    <div>
      <h2>Completed Subjects</h2>

      {records.length === 0 && (
        <p style={{ textAlign: "center" }}>No completed subjects found.</p>
      )}

      {records.map((rec) => (
        <div key={rec._id} className="record-card">
          <p><b>Student ID:</b> {rec.studentId}</p>
          <p><b>Subject:</b> {rec.subjectName}</p>
          <p><b>Exam Date:</b> {rec.examDate}</p>
          <p><b>Planned Hours:</b> {rec.plannedStudyHours}</p>
          <p><b>Status:</b> {rec.syllabusStatus}</p>
        </div>
      ))}
    </div>
  );
}

export default CompletedSubjects;
