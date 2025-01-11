/*global chrome*/
import React, { useState, useEffect } from "react";

function Report() {
  const [showReason, setShowReason] = useState(false);
  const [url, setUrl] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    // Verificăm dacă API-ul Chrome este disponibil
    if (window.chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0]; // Tab-ul activ
        setUrl(activeTab.url); // Setăm URL-ul activ
      });
    }
  }, []);

  const handleToggleChange = () => {
    setShowReason(!showReason);
  };

  const handleSubmitReport = async () => {
    try {
      // Dacă nu există un motiv, trimitem doar URL-ul
      const reportMessage = reason || "No reason provided.";
      console.log("Submitting report...");

      // Trimite cererea către serverul backend
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          reason: reportMessage,
        }),
      });

      if (response.ok) {
        setReason(""); // Curăță textbox-ul după trimitere
      } else {
        alert("Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <h5 className="card-title">Report Malicious URL</h5>
      <p className="card-text">
        The URL of the site:{" "}
        <span id="pageUrl" className="fw-bold">
          {url || "Loading..."}
        </span>
      </p>

      {/* Toggle pentru a adăuga un motiv */}
      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="toggleReason"
          checked={showReason}
          onChange={handleToggleChange}
        />
        <label className="form-check-label" htmlFor="toggleReason">
          Add a reason
        </label>
      </div>

      {/* Textbox care apare doar dacă toggle-ul este activat */}
      {showReason && (
        <textarea
          id="reasonInput"
          className="form-control mb-3"
          rows="3"
          placeholder="Enter your reason here..."
          value={reason} // Legăm valoarea de state
          onChange={(e) => setReason(e.target.value)} // Actualizăm valoarea
        />
      )}

      <button
        className="btn btn-danger w-100"
        id="submitReport"
        onClick={handleSubmitReport}
      >
        Submit Report
      </button>
    </div>
  );
}

export default Report;
