import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import ExamTracker from "./components/ExamTracker";
import CompletedSubjects from "./components/CompletedSubjects";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const recordsRef = useRef(null);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleMode = () => setDarkMode((prev) => !prev);

  return (
    <Router>
      <Navbar toggleMode={toggleMode} />

      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ExamTracker recordsRef={recordsRef} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/completed"
            element={
              <ProtectedRoute>
                <CompletedSubjects />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
