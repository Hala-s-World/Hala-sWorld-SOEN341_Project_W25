import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/homepage.css"; // Import CSS
import logo from "../assets/media/logo.png"; // Import logo
import catImage from "../assets/media/cat.jpg"; // Import cat image

export default function Homepage() {
  return (
    <div className="homepage-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="ChatHaven Logo" className="navbar-logo" />
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/features">Features</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <img src={catImage} alt="Chat Mascot" className="hero-cat" />
        <h1 className="hero-title">C H A T H A V E N</h1>
        <p className="hero-subtitle">
          The ultimate platform for seamless and secure communication.
        </p>
        <Link to="/login" className="cta-button">
          Get Started
        </Link>
      </header>

      {/* Features Section */}
      <section className="features">
        <h2>WHY CHOOSE CHATHAVEN?</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3>💬 Real-Time Messaging</h3>
            <p>Engage with your team in real-time with instant messages.</p>
          </div>
          <div className="feature-item">
            <h3>🔒 Secure & Encrypted</h3>
            <p>
              End-to-end encryption ensures your conversations stay private.
            </p>
          </div>
          <div className="feature-item">
            <h3>🎯 Role-Based Access</h3>
            <p>
              Admins can control user permissions for a structured experience.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2025 ChatHaven. All rights reserved.</p>
      </footer>
    </div>
  );
}
