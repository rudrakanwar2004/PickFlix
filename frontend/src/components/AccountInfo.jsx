import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AccountInfo.css'; // Import your CSS file for styling
function AccountInfo() {
  const navigate = useNavigate();

  // Get the logged-in username from localStorage or the token
  const username = localStorage.getItem('username')?.split('@')[0] || 'User'; // or fetch it from token if stored

  return (
    <div className="account-info-container">
      <h2>Hello, <span role="img" aria-label="wave">👋</span> {username}!</h2>
      
      {/* Add a friendly welcome message with emoji */}
      <p style={{ fontSize: '18px', color: '#fff' }}>
        Welcome To PickFlix <span role="img" aria-label="smile">😊</span> 
      </p>

      {/* Back to PickFlix button */}
      <br /><br />
      <center>
      <button 
        onClick={() => navigate('/home')} 
        className="back-button"
      >
      
      <div className="back-button" onClick={() => navigate('/home')}>
        <div aria-hidden="true" className="arrow-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" role="img" viewBox="0 0 16 16" width="16" height="16" data-icon="ArrowLeftSmall" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M4.81 8.74697L13.9966 8.74697L13.9966 7.24697L4.81095 7.24697L7.52932 4.52961L6.46886 3.46875L2.46959 7.46654C2.32891 7.60716 2.24985 7.79791 2.24982 7.99683C2.24978 8.19574 2.32876 8.38652 2.46939 8.5272L6.46866 12.528L7.52952 11.4675L4.81 8.74697Z" fill="currentColor"></path>
          </svg>
        </div>
        Back
      </div>

      </button>
      </center>
    </div>
  );
}

export default AccountInfo;

