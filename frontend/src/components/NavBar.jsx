import { Link } from "react-router-dom";
import '../css/Navbar.css';
import text from '../assets/text.png';
function NavBar() {
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
      </div>
    </nav>
  );
}

export default NavBar;
