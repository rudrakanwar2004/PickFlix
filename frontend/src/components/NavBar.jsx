import { Link } from "react-router-dom";
import '../css/Navbar.css';
import text from '../assets/text.png';
import { useState, useEffect, useRef } from "react";
import profilePic from '../assets/user.png';

function NavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* Brand Logo */}
      <div className="navbar-brand">
        <Link to="/home">
          <img src={text} alt="Pickflix Logo" className="logo-image" />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <Link to="/favourites" className="nav-link">Favourites</Link>

        {/* Profile Section */}
        <div
          className="profile-section"
          onClick={toggleDropdown}
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
          aria-label="User menu"
          ref={dropdownRef}
          role="button"
          tabIndex={0}
        >
          <img src={profilePic} alt="Profile" className="profile-icon" />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/account" className="dropdown-item">Account Info</Link>
              <Link to="/logout" className="dropdown-item">Logout</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
