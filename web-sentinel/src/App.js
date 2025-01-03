import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Report from "./components/Report";
import Analysis from "./components/Analysis";
import About from "./components/About";

function App() {
  const [activeTab, setActiveTab] = useState("report");

  const renderContent = () => {
    switch (activeTab) {
      case "report":
        return <Report />;
      case "analysis":
        return <Analysis />;
      case "about":
        return <About />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="App">
      <header className="text-center mt-4">
        <h1>Phishing Detection Extension</h1>
      </header>
      <div className="alert alert-info">
        <h5>Website Security Risk</h5>
        <p>
          This website does not present a potential risk of phishing. The
          probability of phishing is approximately 10%.
        </p>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <button
          className={`btn btn-outline-primary mx-2 ${
            activeTab === "report" ? "active" : ""
          }`}
          onClick={() => setActiveTab("report")}
        >
          Report
        </button>
        <button
          className={`btn btn-outline-primary mx-2 ${
            activeTab === "analysis" ? "active" : ""
          }`}
          onClick={() => setActiveTab("analysis")}
        >
          Analysis
        </button>
        <button
          className={`btn btn-outline-primary mx-2 ${
            activeTab === "about" ? "active" : ""
          }`}
          onClick={() => setActiveTab("about")}
        >
          About
        </button>
      </div>

      <div className="container mt-4">{renderContent()}</div>
    </div>
  );
}

export default App;
