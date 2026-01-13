const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // ✅ LOAD ENV VARIABLES

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection (NO localhost in production)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", require("./routes/StudyRoutes"));
app.use("/api/auth", require("./routes/AuthRoutes"));

/* Metrics Endpoint */
const client = require("prom-client");
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// ✅ IMPORTANT: Use Render's PORT
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
