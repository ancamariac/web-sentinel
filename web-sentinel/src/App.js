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
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand">Phishing Extension</span>
          <ul className="navbar-nav">
            <li className="nav-item">
              <button
                className={`nav-link btn ${
                  activeTab === "report" ? "active" : ""
                }`}
                onClick={() => setActiveTab("report")}
              >
                Report
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn ${
                  activeTab === "analysis" ? "active" : ""
                }`}
                onClick={() => setActiveTab("analysis")}
              >
                Analysis
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link btn ${
                  activeTab === "about" ? "active" : ""
                }`}
                onClick={() => setActiveTab("about")}
              >
                About
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container mt-4">{renderContent()}</div>
    </div>
  );
}

export default App;
