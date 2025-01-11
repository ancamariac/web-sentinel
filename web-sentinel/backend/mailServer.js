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
app.use(cors({
   origin: ["http://localhost:3000", "chrome://extensions/?id=lobkjghbgbbpjdmgldlfpapmiipeeoko"], // Adaugă ID-ul extensiei tale
   methods: ["GET", "POST"],
   allowedHeaders: ["Content-Type"]
 }));
 

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
        HTMLPart: `<h3>A report was submitted for the following URL: ${url}</h3><br><strong>Reason:</strong> ${reason}`,
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
