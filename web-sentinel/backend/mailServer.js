const express = require("express");
const cors = require("cors");
const mailjet = require("node-mailjet").connect(
  "90b19860b64f60977de20ceb87968044", // API key public
  "0bf838299c709d713238f25965c2503f" // API key privat
);
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// API key pentru VirusTotal
const VIRUSTOTAL_API_KEY =
  "7d3c7159035fdc40ce8ec838d2de73755c22a829bccda9229639163d2dcd9cce"; // Înlocuiește cu cheia ta

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "chrome://extensions/?id=lobkjghbgbbpjdmgldlfpapmiipeeoko",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const getVirusTotalAnalysis = async (url) => {
  try {
    const submitResponse = await axios.post(
      "https://www.virustotal.com/api/v3/urls",
      new URLSearchParams({ url }).toString(),
      {
        headers: {
          "x-apikey": VIRUSTOTAL_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const scanId = submitResponse.data.data.id;

    let analysisResponse;
    let status = "queued";

    // Așteaptă finalizarea analizei
    while (status === "queued" || status === "processing") {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Așteaptă 5 secunde
      analysisResponse = await axios.get(
        `https://www.virustotal.com/api/v3/analyses/${scanId}`,
        {
          headers: {
            "x-apikey": VIRUSTOTAL_API_KEY,
          },
        }
      );

      status = analysisResponse.data.data.attributes.status;
    }

    const stats = analysisResponse.data.data.attributes.stats;

    return {
      clean: stats.harmless || 0,
      malicious: stats.malicious || 0,
      suspicious: stats.suspicious || 0,
      unrated: stats.undetected || 0,
      results: analysisResponse.data.data.attributes.results,
    };
  } catch (err) {
    console.error("Error fetching VirusTotal data:", err.message);
    return null;
  }
};

app.post("/send-email", async (req, res) => {
  const { url, reason, category } = req.body;

  // Obține analiza de la VirusTotal
  const vtAnalysis = await getVirusTotalAnalysis(url);

  let vtInfo = "VirusTotal analysis unavailable.";

  if (vtAnalysis) {
    vtInfo = `
      <h3>VirusTotal Analysis</h3>
      <p><strong>Malicious reports:</strong> ${vtAnalysis.malicious}</p>
      <p><strong>Harmless reports:</strong> ${vtAnalysis.clean}</p>
      <p><strong>Unrated reports:</strong> ${vtAnalysis.unrated}</p>
    `;
  }

  // Trimite email-ul
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "contact.websentinel@gmail.com",
          Name: "Contact",
        },
        To: [
          {
            Email: "contact.websentinel@gmail.com",
            Name: "You",
          },
        ],
        Subject: "Malicious URL Report",
        HTMLPart: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Poppins', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
              .container { width: 100%; padding: 20px; text-align: left; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
              .content { width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #ccc; border-radius: 8px; overflow: hidden; }
              .header { background-color: #345C72; padding: 30px; color: white; font-size: 24px; font-weight: bold; text-align: center; }
              .body { padding: 30px; font-size: 16px; color: #333333; line-height: 1.6; }
              .footer { background-color: #333333; color: #ffffff; padding: 20px; font-size: 14px; text-align: center; }
              .footer a { color: #ffffff; text-decoration: none; }
           </style>
          </head>
          <body>
          <div class="container">
            <div class="content">
              <div class="header">Suspicious Website Report</div>
              <div class="body">
                <p>Dear WebSentinel Team,</p>
                <p>A user of the WebSentinel browser extension has reported the following website:</p>
                <h3>Reported Website</h3>
                <p><a href="${url}" target="_blank" style="color: #345C72; text-decoration: underline;">${url}</a></p>
                <h3>Reason Provided</h3>
                <p>${reason}</p>
                <h3>
               Category reported by user: 
               <span style="color: ${
                 category === "Phishing"
                   ? "red"
                   : category === "Legitimate"
                   ? "green"
                   : "black"
               };">
                  ${category}
               </span>
               </h3>
                ${vtInfo}
              </div>
              <div class="footer">
                <p>Thank you for working towards a safer internet.</p>
                <p>Copyright &copy; 2025 | <a href="https://websentinel.com">WebSentinel</a></p>
              </div>
            </div>
          </div>
          </body>
          </html>
        `,
      },
    ],
  });

  try {
    const result = await request;
    res.status(200).send("Email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err.message);
    res.status(500).send("Failed to send email");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
