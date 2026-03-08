import { useState, useEffect } from "react";
import Home from "./Home.jsx";
import About from "./About.jsx";
import Experience from "./Experience.jsx";
import './App.css'
import Navbar from "./Navbar.jsx";

function App() {
  const [showRoom, setShowRoom] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNavigation = (page) => {
    if (page === '3d') {
      setShowRoom(true);
      return;
    }
    setShowRoom(false);
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case 'about':
        return <About isDarkMode={isDarkMode} />;
      default:
        return <Home isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
    }
  };

  return (
    <>
      {showRoom ? (
        <Experience
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      ) : (
        <>
          <Navbar
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            currentPage={currentPage}
            onNavigation={handleNavigation}
          />
          {renderCurrentPage()}
        </>
      )}
    </>
  )
}

export default App
