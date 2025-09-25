import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css"; // we’ll create this file
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <video autoPlay loop muted className="landing-video">
        <source src="/promo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="overlay">
        <header className="header">
          <h1 className="brand-text">
            Katha <span> Sangam</span>
          </h1>
        </header>
        <button className="home-btn" onClick={() => navigate("/home")}>
          Go to Home
        </button>
      </div>
    </div>
  );
}
