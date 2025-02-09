import '../css/welcome.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import your logo

const Welcome = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/home'); // Navigate to home when the button is clicked
  };

  return (
    <div className="welcome-container">
      {/* Logo */}
      <img src={logo} alt="PickFlix Logo" className="welcome-logo" />

      {/* Title */}
      <h1 className="welcome-title">Unlock a World of Personalized Movies at PickFlix!</h1>

      {/* Button */}
      <button className="welcome-button" onClick={handleClick}>
        Let's get started
      </button>
    </div>
  );
};

export default Welcome;

