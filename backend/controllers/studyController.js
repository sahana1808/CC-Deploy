const addStudyRecord = (req, res) => {
  const { studentId, subjectName, examDate, plannedStudyHours } = req.body;

  const studyRecord = {
    studentId,
    subjectName,
    examDate,
    syllabusStatus: "Not Started",
    plannedStudyHours,
    completedStudyHours: 0,
    examStatus: "Upcoming"
  };

  res.status(201).json({
    message: "Study record added successfully",
    data: studyRecord
  });
};

module.exports = { addStudyRecord };
