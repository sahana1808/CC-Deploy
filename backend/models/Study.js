const mongoose = require("mongoose");

const StudySchema = new mongoose.Schema({
  studentId: String,
  subjectName: String,
  examDate: Date,
  plannedStudyHours: Number,
  syllabusStatus: {
    type: String,
    default: "Not Started"
  }
});

module.exports = mongoose.model("Study", StudySchema);
