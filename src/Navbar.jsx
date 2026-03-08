import { useState } from "react";
import "./Navbar.css";

export default function Navbar({ isDarkMode, toggleTheme, currentPage, onNavigation }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (page) => {
    onNavigation(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        
        {/* Left: Logo */}
        <a className="navbar-brand" href="#" onClick={() => handleNavClick('home')}>
          <h3>TEJAS</h3>
        </a>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler d-lg-none"
          type="button"
          onClick={toggleMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Middle: Links - Desktop */}
        <div className="d-none d-lg-flex justify-content-center flex-grow-1">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a 
                className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} 
                href="#" 
                onClick={() => handleNavClick('home')}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${currentPage === 'about' ? 'active' : ''}`} 
                href="#" 
                onClick={() => handleNavClick('about')}
              >
                About
              </a>
            </li>
            <li className="nav-item"><a className="nav-link" href="#">Projects</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Contact</a></li>
          </ul>
        </div>

        {/* Middle: Links - Mobile */}
        <div
          className={`position-fixed top-0 start-0 w-100 p-3 ${isMenuOpen ? "d-block" : "d-none"} d-lg-none`}
          style={{ zIndex: 1030 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>TEJAS</h3>
            <button className="btn-close" onClick={toggleMenu}></button>
          </div>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a 
                className={`nav-link py-2 ${currentPage === 'home' ? 'active' : ''}`} 
                href="#" 
                onClick={() => handleNavClick('home')}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link py-2 ${currentPage === 'about' ? 'active' : ''}`} 
                href="#" 
                onClick={() => handleNavClick('about')}
              >
                About
              </a>
            </li>
            <li className="nav-item"><a className="nav-link py-2" href="#">Projects</a></li>
            <li className="nav-item"><a className="nav-link py-2" href="#">Contact</a></li>
          </ul>
        </div>

        {/* Right: Theme Toggle Button */}
        <div>
          <button
            className="btn btn-outline-light rounded-pill px-4"
            onClick={toggleTheme}
          >
            {isDarkMode ? "Light up the Talk" : "Dark up the Talk"}
          </button>
        </div>

      </div>
    </nav>
  );
}
