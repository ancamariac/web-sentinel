/*global chrome*/
import React, { useState, useEffect } from "react";
import ReportSubmitted from "./ReportSubmitted"; // Importă noua componentă

function Report() {
  const [showReason, setShowReason] = useState(false);
  const [url, setUrl] = useState("");
  const [reason, setReason] = useState("");
  const [reportStatus, setReportStatus] = useState(""); // State pentru mesajul de status
  const [selectedCategory, setSelectedCategory] = useState(""); // State pentru categoria selectată (Phishing sau Legitimate)
  const [isReportSent, setIsReportSent] = useState(false); // State pentru a verifica dacă raportul a fost trimis
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State pentru a arăta mesajul de succes
  const [isLoading, setIsLoading] = useState(false); // Pentru loader

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

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubmitReport = async () => {
    if (!selectedCategory) {
      alert(
        "Please select a category (Phishing or Legitimate) before submitting your report."
      );
      return;
    }

    if (isReportSent) {
      setReportStatus("You have already submitted a report for this website.");
      setShowSuccessMessage(true);
      return;
    }

    setIsLoading(true); // 🔥 Afișează loaderul

    try {
      const reportMessage = reason || "No reason provided.";
      const email =
        localStorage.getItem("reportEmail") || "contact.websentinel@gmail.com";

      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
          reason: reportMessage,
          category: selectedCategory,
          email: email,
        }),
      });

      if (response.ok) {
        const reportedUrls =
          JSON.parse(localStorage.getItem("reportedUrls")) || [];
        reportedUrls.push(url);
        localStorage.setItem("reportedUrls", JSON.stringify(reportedUrls));

        setReason("");
        setSelectedCategory("");
        setIsReportSent(true);
        setShowSuccessMessage(true);
      } else {
        alert("Failed to submit report. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error submitting report:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false); // 🔥 Ascunde loaderul
    }
  };

  return (
    <div>
      {isReportSent || showSuccessMessage ? (
        // Dacă raportul a fost trimis sau este deja trimis
        <ReportSubmitted /> // Afișează componenta ReportSubmitted
      ) : !isLoading ? (
        // Formularul inițial pentru raport
        <div>
          <h6 className="card-title" style={{ display: "inline" }}>
            Report URL :{" "}
          </h6>
          <span
            id="pageUrl"
            className="fw-bold"
            style={{ fontStyle: "italic" }}
          >
            {url || "Loading..."}
          </span>
          {/* Dropdown pentru alegerea categoriei */}

          <div className="mb-3">
            <br></br>
            <select
              id="categorySelect"
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Phishing">Phishing</option>
              <option value="Legitimate">Legitimate</option>
            </select>
          </div>

          {/* Toggle pentru a adăuga un motiv */}
          <div
            className="form-check form-switch mb-3"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center", // Centrează pe orizontală
              gap: "10px", // Spațiu între etichetă și toggle
              width: "100%", // Ocupă întreaga lățime
            }}
          >
            <label
              className="form-check-label"
              htmlFor="toggleReason"
              style={{
                fontWeight: "500",
                fontSize: "15px",
                margin: "0", // Elimină marginile implicite
              }}
            >
              Add a reason
            </label>
            <input
              className="form-check-input"
              type="checkbox"
              id="toggleReason"
              checked={showReason}
              onChange={handleToggleChange}
              style={{
                marginLeft: "0", // Asigură că toggle-ul nu se suprapune cu textul
              }}
            />
          </div>

          {/* Textbox care apare doar dacă toggle-ul este activat */}
          {showReason && (
            <textarea
              id="reasonInput"
              className="form-control mb-3"
              rows="3"
              placeholder="Enter your reason here..."
              // Legăm valoarea de state
              onChange={(e) => setReason(e.target.value)}
            />
          )}

          <button
            className="btn btn-primary w-100"
            style={{ backgroundColor: "#0056b3" }}
            id="submitReport"
            onClick={handleSubmitReport}
            disabled={isReportSent}
          >
            Submit
          </button>

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
      ) : (
        <div className="text-center mt-3">
          <p
            style={{
              fontWeight: "500",
              marginBottom: "10px",
            }}
          >
            Please wait while we prepare the report ...
          </p>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden"></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Report;
