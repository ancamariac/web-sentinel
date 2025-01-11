/* global chrome */
import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Report from "./components/Report";
import Analysis from "./components/Analysis";
import About from "./components/About";
const { featureExtraction } = require("./components/featureExtractor");

function App() {
  const [activeTab, setActiveTab] = useState("report");
  const [url, setUrl] = useState("");
  const [phishingProbability, setPhishingProbability] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const predictPhishingProbability = async (inputUrl) => {
    setIsLoading(true);
    try {
      const model = await tf.loadLayersModel("/model/model.json"); // Încarcă modelul
      // Extrag caracteristicile folosind featureExtraction
      const features = featureExtraction(inputUrl);

      // Transform caracteristicile într-un tensor
      const processedInput = tf.tensor2d([features], [1, features.length]);

      // Obțin predicția
      const prediction = model.predict(processedInput);
      const probability = prediction.dataSync()[0]; // Extrage valoarea din tensor

      // Interpretează rezultatul
      const percentage = (probability * 100).toFixed(2);
      let classification = "";

      // Aplică logica de clasificare
      if (probability >= 0.5) {
        classification = "Phishing";
      } else if (probability <= 0.3) {
        classification = "Legitim";
      } else {
        classification = "Caution Advised";
      }

      // Actualizează starea aplicației
      setPhishingProbability(`${percentage}% - ${classification}`);
    } catch (error) {
      console.error("Eroare la încărcarea modelului sau la predicție:", error);
      setPhishingProbability("Error loading prediction");
    } finally {
      setIsLoading(false);
    }
  };

  // Folosim useEffect pentru a obține URL-ul curent
  useEffect(() => {
    if (window.chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0]; // Tab-ul activ
        setUrl(activeTab.url); // Setăm URL-ul activ
        predictPhishingProbability(activeTab.url); // Efectuăm predicția pentru URL
      });
    }
  }, []);

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
      <header className="text-center">
        <h1>Phishing Detection Extension 🌐🕵️‍♂️</h1>
      </header>
      <div className="alert alert-info">
        <h5>Website Security Risk</h5>
        {isLoading ? (
          <p>Loading phishing probability...</p>
        ) : (
          <p>
            The probability of phishing for this website is approximately{" "}
            <strong>{phishingProbability}</strong>.
          </p>
        )}
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
