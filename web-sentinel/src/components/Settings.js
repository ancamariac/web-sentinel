import React, { useState } from "react";

function Settings() {
  // State pentru a salva adresa de email, cu valoarea implicită
  const [email, setEmail] = useState(
    localStorage.getItem("reportEmail") || "contact.websentinel@gmail.com"
  );

  // Funcție pentru a gestiona modificările la câmpul de email
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Funcție pentru a salva setările
  const handleSaveSettings = () => {
    // Aici ar trebui să salvezi adresa de email în localStorage sau într-o altă metodă de stocare
    localStorage.setItem("reportEmail", email);
    alert("The email address was saved!");
  };

  return (
    <div>
      <h5>Email of the analyzer 📧</h5>
      <p className="card-text">
        Enter the email address of the team that will receive your reports.
      </p>
      <input
        type="email"
        className="form-control mb-3"
        value={email} // Adresa de email setată din state
        onChange={handleEmailChange} // Actualizează email-ul pe măsură ce utilizatorul scrie
        placeholder="Enter your email"
      />
      <br></br>
      <button 
         className="btn btn-primary w-100" 
         style={{ backgroundColor: '#0056b3' }}
         onClick={handleSaveSettings}>
         Save email
      </button>
    </div>
  );
}

export default Settings;
