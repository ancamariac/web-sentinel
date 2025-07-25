# Web Sentinel

**Web Sentinel** is a browser extension that provides real-time protection against phishing websites using a machine learning-based binary classification model. With a detection accuracy of **91%**, it helps users stay safe while browsing and actively contributes to the identification of new phishing threats through user reports.

## 🔒 Features

- ⚡ Real-time phishing detection using a binary ML classifier  
- 📊 91% classification accuracy on test data  
- 📩 Email-based phishing site reporting  
- 🧠 Continuous model improvement via user-submitted reports  
- 🧩 Easy integration into Chromium-based browsers

---

## 📥 Reporting Suspicious Websites

Users can report suspicious websites directly from the extension popup. When a site is flagged or suspected to be phishing:

1. Click the Web Sentinel icon in your browser toolbar.
2. Select "Submit Report" from the extension menu.
3. Choose whether the site is Phishing or Legitimate.
4. (Optional) Provide a short explanation or reason for your report in the text box.
5. Click "Submit Report" to securely send the URL, classification, and any notes to the configured reporting address.

These reports help improve detection accuracy by feeding new samples back into the training pipeline.

<p align="center">
  <img src="https://github.com/user-attachments/assets/bc0b138c-56e7-4c03-932c-9724305ffdbb" width="200" />
  <img src="https://github.com/user-attachments/assets/f8e2f030-a6f9-4ace-a7f8-9006179e0db2" width="235" />
</p>


---

## ⚙️ Email Configuration

To enable email-based reporting:

1. Open the extension settings.
2. Enter the email address where reports should be sent.

All reports are sent using a secure POST request to a backend or an SMTP integration, depending on your deployment setup.

<p align="center">
  <img src="https://github.com/user-attachments/assets/509e4838-6374-4bab-8935-018769664bce" width="211" />
</p>

---

## 📈 Model Metrics

The phishing detection model was trained on a curated dataset of labeled URLs, using a supervised learning pipeline. Below are key performance metrics:

| Metric            | Value     |
|-------------------|-----------|
| Accuracy          | 91.35%       |
| Precision         | 91.53%       |
| Recall (TPR)      | 91.31%       |
| F1 Score          | 91.48%       |
| Model Type        | Binary Classifier (Custom Neural Network) |
| Features Used     | URL structure, domain entropy, HTTPS presence, known blacklist, etc. |

The model can be retrained periodically using new data collected from user reports, allowing adaptive threat detection.

---

## 🕵️‍♂️ Reporting Overview

<img src="https://github.com/user-attachments/assets/b0250a19-da8b-426a-ae19-7d85c2a46d02" width="75%" alt="image" />


---

## 🧠 Machine Learning Model

The phishing detection engine used by **Web Sentinel** is powered by a supervised machine learning model trained to distinguish between legitimate and phishing URLs based on multiple features such as URL structure, domain entropy, and security indicators.

You can find the full implementation, training pipeline, and evaluation results of the model in the companion repository:

🔗 [Phishing Detection – ML Model Repository](https://github.com/ancamariac/phishing-detection)

This separate repository includes:
- Feature engineering logic
- Model training scripts
- Evaluation metrics and visualizations
- Exported model files used in the Web Sentinel extension

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/web-sentinel.git
