import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ toggleMode }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-actions">
        <button className="nav-btn" onClick={() => navigate("/")}>
          Home
        </button>

        <button
          className="nav-btn outline"
          onClick={() => navigate("/completed")}
        >
          Completed Subjects
        </button>

        <button
          className="nav-btn outline"
          onClick={toggleMode}
        >
          Change Mode
        </button>

        {!localStorage.getItem("token") ? (
          <>
            <button className="nav-btn outline" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="nav-btn outline" onClick={() => navigate("/register")}>
              Register
            </button>
          </>
        ) : (
          <button
            className="nav-btn outline"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              navigate("/login");
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
