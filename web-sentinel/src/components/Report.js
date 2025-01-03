import React, { useState } from "react";

function Report() {
  const [showReason, setShowReason] = useState(false);

  const handleToggleChange = () => {
    setShowReason(!showReason);
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Report Malicious URL</h5>
        <p className="card-text">
          The URL of the site:{" "}
          <span id="pageUrl" className="fw-bold">
            https://example.com
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
          />
        )}

        <button className="btn btn-danger w-100" id="submitReport">
          Submit Report
        </button>
      </div>
    </div>
  );
}

export default Report;
