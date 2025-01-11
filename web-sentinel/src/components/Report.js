/*global chrome*/
import React, { useState, useEffect } from "react";
import ReportSubmitted from "./ReportSubmitted"; // Importă noua componentă

function Report() {
  const [showReason, setShowReason] = useState(false);
  const [url, setUrl] = useState("");
  const [reason, setReason] = useState("");
  const [isReportSent, setIsReportSent] = useState(false); // State pentru a verifica dacă raportul a fost trimis
  const [reportStatus, setReportStatus] = useState(""); // State pentru mesajul de status (succes sau deja trimis)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State pentru a arăta mesajul de succes

  useEffect(() => {
    // Verificăm dacă API-ul Chrome este disponibil
    if (window.chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0]; // Tab-ul activ
        setUrl(activeTab.url); // Setăm URL-ul activ
      });
    }

    // Verifică dacă am trimis deja un raport pentru acest URL
    const reportedUrls = JSON.parse(localStorage.getItem("reportedUrls")) || [];
    if (reportedUrls.includes(url)) {
      setIsReportSent(true); // Dacă URL-ul a fost raportat deja, setează `isReportSent` la true
      setReportStatus("You have already submitted a report for this website."); // Mesaj că raportul a fost deja trimis
    }
  }, [url]);

  const handleToggleChange = () => {
    setShowReason(!showReason);
  };

  const handleSubmitReport = async () => {
    if (isReportSent) {
      // Dacă raportul a fost deja trimis pentru acest URL, se afișează doar mesajul de status
      setReportStatus("You have already submitted a report for this website.");
      setShowSuccessMessage(true);
      return;
    }

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
        // După trimiterea raportului, stocăm URL-ul în localStorage pentru a preveni trimiterea ulterioară
        const reportedUrls =
          JSON.parse(localStorage.getItem("reportedUrls")) || [];
        reportedUrls.push(url);
        localStorage.setItem("reportedUrls", JSON.stringify(reportedUrls));

        setReason(""); // Curăță textbox-ul după trimitere
        setIsReportSent(true); // Setează că raportul a fost trimis
        setShowSuccessMessage(true); // Arată mesajul de succes
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
      {isReportSent || showSuccessMessage ? (
        // Dacă raportul a fost trimis sau este deja trimis
        <ReportSubmitted /> // Afișează componenta ReportSubmitted
      ) : (
        // Formularul inițial pentru raport
        <div>
          <h5 className="card-title">Report Malicious URL</h5>
          <p className="card-text">
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
            disabled={isReportSent} // Dezactivează butonul dacă raportul a fost trimis
          >
            Submit Report
          </button>

          {/* Mesajul de status */}
          {reportStatus && (
            <div
              className={`alert mt-3 ${
                isReportSent ? "alert-success" : "alert-info"
              }`}
              role="alert"
            >
              {reportStatus}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Report;
