import React, { useState, useEffect } from "react";
import StudyCardTimer from "./StudyCardTimer";
import API_BASE_URL from "../api";

function ExamTracker({ recordsRef, showCompleted }) {

  const [records, setRecords] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const [editData, setEditData] = useState({
    examDate: "",
    plannedStudyHours: "",
    syllabusStatus: ""
  });

  const [formData, setFormData] = useState({
    studentId: "",
    subjectName: "",
    examDate: "",
    plannedStudyHours: ""
  });

  /* ================= FETCH RECORDS ON LOAD ================= */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/study`)
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch(() => console.error("Failed to fetch records"));
  }, []);

  const getExamStatus = (examDate) => {
    const today = new Date();
    const exam = new Date(examDate);
    return exam >= today ? "Upcoming" : "Completed";
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= ADD RECORD ================= */
  const addStudyRecord = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE_URL}/api/study`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const newRecord = await res.json();
    setRecords([...records, newRecord]);

    setFormData({
      studentId: "",
      subjectName: "",
      examDate: "",
      plannedStudyHours: ""
    });
  };

  /* ================= OPEN UPDATE CARD ================= */
  const openUpdateCard = (index) => {
    setEditIndex(index);
    setEditData({
      examDate: records[index].examDate,
      plannedStudyHours: records[index].plannedStudyHours,
      syllabusStatus: records[index].syllabusStatus
    });
  };

  /* ================= SAVE UPDATE ================= */
  const saveUpdate = async () => {
    const id = records[editIndex]._id;

    const res = await fetch(`${API_BASE_URL}/api/study/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData)
    });

    const updatedRecord = await res.json();

    const updatedRecords = [...records];
    updatedRecords[editIndex] = updatedRecord;
    setRecords(updatedRecords);
    setEditIndex(null);
  };

  /* ================= DELETE RECORD ================= */
  const deleteRecord = async (index) => {
    const id = records[index]._id;

    await fetch(`${API_BASE_URL}/api/study/${id}`, {
      method: "DELETE"
    });

    setRecords(records.filter((_, i) => i !== index));
  };

  /* ================= UPDATE STATUS ONLY ================= */
  const updateRecordStatus = async (index, newStatus) => {
    const record = records[index];
    // Avoid unnecessary API calls
    if (record.syllabusStatus === newStatus) return;

    const id = record._id;
    const updatedData = { ...record, syllabusStatus: newStatus };

    try {
      const res = await fetch(`${API_BASE_URL}/api/study/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });

      if (res.ok) {
        const updatedRecord = await res.json();
        const updatedRecords = [...records];
        updatedRecords[index] = updatedRecord;
        setRecords(updatedRecords);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div>
      {/* HERO */}
      <h2>Welcome to the Study Management Portal</h2>
      <p className="subtitle">
        Manage subjects, track exam schedules, and monitor study progress
        efficiently in one centralized system.
      </p>

      {/* ADD RECORD */}
      <h2>Add Study Record</h2>

      <form onSubmit={addStudyRecord}>
        <input
          name="studentId"
          placeholder="Student ID"
          value={formData.studentId}
          onChange={handleFormChange}
          required
        />

        <input
          name="subjectName"
          placeholder="Subject Name"
          value={formData.subjectName}
          onChange={handleFormChange}
          required
        />

        <input
          type="date"
          name="examDate"
          value={formData.examDate}
          onChange={handleFormChange}
          required
        />

        <input
          type="number"
          name="plannedStudyHours"
          placeholder="Planned Hours"
          value={formData.plannedStudyHours}
          onChange={handleFormChange}
          required
        />

        <button type="submit">Add Record</button>
      </form>

      <hr />

      {/* RECORDS */}
      <h2 ref={recordsRef}>Study Records</h2>

      {
        records
          .filter((rec) =>
            showCompleted ? rec.syllabusStatus === "Completed" : true
          )
          .map((rec, index) => (

            <div key={rec._id} className="record-card">
              <p><b>Student ID:</b> {rec.studentId}</p>
              <p><b>Subject:</b> {rec.subjectName}</p>
              <p><b>Exam Date:</b> {rec.examDate}</p>
              <p><b>Planned Hours:</b> {rec.plannedStudyHours}</p>
              <p><b>Syllabus Status:</b> {rec.syllabusStatus}</p>
              <p><b>Exam Status:</b> {getExamStatus(rec.examDate)}</p>

              <div className="countdown-section">
                <b>Time Remaining:</b>
                <StudyCardTimer
                  plannedHours={rec.plannedStudyHours}
                  onStart={() => updateRecordStatus(index, "In Progress")}
                  onComplete={() => updateRecordStatus(index, "Completed")}
                />
              </div>

              <div className="record-actions">
                <button className="update-btn" onClick={() => openUpdateCard(index)}>
                  Update
                </button>

                <button className="delete-btn" onClick={() => deleteRecord(index)}>
                  Delete
                </button>
              </div>

              {/* UPDATE CARD */}
              {editIndex === index && (
                <div className="update-card">
                  <h4>Update Record</h4>

                  <input
                    type="date"
                    value={editData.examDate}
                    onChange={(e) =>
                      setEditData({ ...editData, examDate: e.target.value })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Planned Hours"
                    value={editData.plannedStudyHours}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        plannedStudyHours: e.target.value
                      })
                    }
                  />

                  <select
                    value={editData.syllabusStatus}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        syllabusStatus: e.target.value
                      })
                    }
                  >
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>

                  <br /><br />

                  <button className="save-btn" onClick={saveUpdate}>
                    Save
                  </button>

                  <button
                    className="cancel-btn"
                    onClick={() => setEditIndex(null)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
      }
    </div >
  );
}

export default ExamTracker;
