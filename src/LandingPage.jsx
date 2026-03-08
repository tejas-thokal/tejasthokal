import { useState, useEffect } from "react";
import "./LandingPage.css";

export default function LandingPage({ onTransitionComplete, isDarkMode, toggleTheme }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Start the entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    setIsTransitioning(true);
    // Wait for transition animation to complete before calling the callback
    setTimeout(() => {
      onTransitionComplete();
    }, 1000);
  };

  return (
    <div className={`landing-page ${isVisible ? 'visible' : ''} ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="landing-content">
        <h1 className="name-text">Tejas Thokal</h1>
        <div className="subtitle">Welcome to my portfolio</div>
        <button className="enter-button" onClick={handleClick}>
          Enter
        </button>
      </div>
      
      {/* Animated background elements */}
      <div className="background-elements">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-circle circle-4"></div>
      </div>
    </div>
  );
}
