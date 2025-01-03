import React from "react";

function Analysis() {
  return (
    <div>
      <h2>Request Detailed Analysis</h2>
      <p>Enter your email to request a detailed analysis of a URL.</p>
      <input type="email" className="form-control mb-3" placeholder="Enter your email" />
      <button className="btn btn-primary">Request Analysis</button>
    </div>
  );
}

export default Analysis;
