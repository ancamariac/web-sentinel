const express = require("express");
const cors = require("cors");
const mailjet = require("node-mailjet").connect(
  "90b19860b64f60977de20ceb87968044", // API key public
  "0bf838299c709d713238f25965c2503f" // API key privat
);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pentru a parsa corpul cererii
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "chrome://extensions/?id=lobkjghbgbbpjdmgldlfpapmiipeeoko",
    ], // Adaugă ID-ul extensiei tale
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// Endpoint pentru a trimite email
app.post("/send-email", async (req, res) => {
  console.log(req.body); // Afișează corpul cererii pentru a vedea ce se primește
  const { url, reason } = req.body;

  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "contact.websentinel@gmail.com", // Înlocuiește cu email-ul valid
          Name: "Contact",
        },
        To: [
          {
            Email: "contact.websentinel@gmail.com", // Destinatar
            Name: "You",
          },
        ],
        Subject: "Malicious URL Report",
        TextPart: `A report was submitted for the following URL: ${url}\n\nReason: ${reason}`,
        HTMLPart: `
          <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
               body {
                  font-family: 'Poppins', Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
               }
               .container {
                  width: 100%;
                  border-radius: 10px;
                  padding: 20px;
                  text-align: left;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
               }
               .content {
                  width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  border-radius: 8px;
                  overflow: hidden;
               }
               .content-table {
                  width: 100%;
                  border: 1px solid rgb(152, 152, 152); /* Border gri subtire */
                  border-collapse: collapse;
                  margin: 20px 0;
                  background-color: #ffffff;
               }
               .header {
                  background-color: #345C72;
                  padding: 30px;
                  color: white;
                  font-size: 24px;
                  font-weight: bold;
                  text-align: center;
               }
               .body {
                  padding: 30px;
                  font-size: 16px;
                  color: #333333;
                  text-align: left; /* Center the button */
                  line-height: 1.6;
               }
               .cta-button {
                  background-color: #345C72;
                  color: #ffffff;
                  text-decoration: none;
                  padding: 10px 20px;
                  border-radius: 5px;
                  font-weight: bold;
                  display: inline-block;
                  margin: 20px 0;
               }
               .cta-button:hover {
                  background-color: #2c4e5e;
               }
               .footer {
                  background-color: #333333;
                  color: #ffffff;
                  padding: 20px;
                  font-size: 14px;
                  text-align: center;
               }
               .footer a {
                  color: #ffffff;
                  text-decoration: none;
               }
               .reason {
                  font-style: italic; /* Stil italic pentru motiv */
                  color: #555555; /* Culoare gri mai subtilă */
               }
            </style>
            </head>
            <body>
            <div class="container">
               <div class="content">
                  <table class="content-table">
                     <!-- Header -->
                     <tr>
                        <td class="header">
                           Suspicious Website Report
                        </td>
                     </tr>

                     <!-- Body -->
                     <tr>
                        <td class="body">
                           <p>Dear WebSentinel Team,</p>
                           <p>A user of the WebSentinel browser extension has reported the following website as suspicious:</p>
                           <h3>Reported Website</h3>
                           <p><a href=${url} target="_blank" style="color: #345C72; text-decoration: underline;">${url}</a></p>
                           <h3>Reason Provided</h3>
                           <p class="reason">${reason}</p>
                           <p>We encourage you to review the reported website and take appropriate action to ensure the safety of users.</p>
                           <a href=${url} target="_blank" style="color: #ffffff; text-decoration: none; font-weight: bold; display: inline-block; padding: 10px 20px; background-color: #345C72; border-radius: 5px; text-align: center;">Visit Reported Website</a>
                        </td>
                     </tr>

                     <!-- Footer -->
                     <tr>
                        <td class="footer">
                           <p>Thank you for working towards a safer internet.</p>
                           <p>Copyright &copy; 2025 | <a href="https://websentinel.com">WebSentinel</a></p>
                        </td>
                     </tr>
                  </table>
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
    console.log(result.body);
    res.status(200).send("Email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err.statusCode);
    res.status(500).send("Failed to send email");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
