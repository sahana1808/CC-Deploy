import React, { useState, useEffect } from "react";

const StudyCardTimer = ({ plannedHours, onStart, onComplete }) => {
    // Convert hours to seconds
    const initialTime = (parseFloat(plannedHours) || 0) * 3600;
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggle = () => {
        if (timeLeft > 0) {
            if (!isActive && onStart) {
                onStart();
            }
            setIsActive(!isActive);
        }
    };



    const handleComplete = () => {
        setIsActive(false);
        setTimeLeft(0);
        if (onComplete) onComplete();
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className="study-card-timer">
            <div className="time-display">{formatTime(timeLeft)}</div>
            <div className="timer-controls-sm">
                <button
                    className={`btn-sm ${isActive ? "btn-pause" : "btn-start"}`}
                    onClick={toggle}
                >
                    {isActive ? "Pause" : "Start"}
                </button>
                <button className="btn-sm btn-complete" onClick={handleComplete}>
                    Complete
                </button>
            </div>
        </div>
    );
};

export default StudyCardTimer;
