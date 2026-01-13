const express = require("express");
const router = express.Router();
const Study = require("../models/Study");

/* CREATE */
router.post("/study", async (req, res) => {
  const record = new Study(req.body);
  await record.save();
  res.json(record);
});

/* READ */
router.get("/study", async (req, res) => {
  const records = await Study.find();
  res.json(records);
});

/* UPDATE */
router.put("/study/:id", async (req, res) => {
  const updated = await Study.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

/* DELETE */
router.delete("/study/:id", async (req, res) => {
  await Study.findByIdAndDelete(req.params.id);
  res.json({ message: "Record deleted" });
});

// GET only completed subjects
router.get("/study/completed", async (req, res) => {
  try {
    const completedRecords = await Study.find({
      syllabusStatus: "Completed"
    });
    res.json(completedRecords);
  } catch (error) {
    res.status(500).json({ message: "Error fetching completed subjects" });
  }
});

module.exports = router;
