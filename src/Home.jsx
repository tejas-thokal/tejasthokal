import { useRef, useEffect, useState } from "react";
import "./Home.css";

export default function Home({ isDarkMode, toggleTheme }) {
  const containerRef = useRef(null);
  const bwRef = useRef(null);
  const colorRef = useRef(null);
  const [showBubble, setShowBubble] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const bwImage = bwRef.current;
    const colorImage = colorRef.current;

    const handleMouseMove = (e) => {
      const { left, width } = container.getBoundingClientRect();
      const percent = ((e.clientX - left) / width) * 100;
    
      // Update clip path
      bwImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      colorImage.style.clipPath = `inset(0 0 0 ${percent}%)`;
    
      // Opposite movement: left cursor → image moves right
      const moveRange = 30; // reduced movement range
      const offset = ((50 - percent) / 50) * moveRange; 
      container.querySelector(".interactive-image").style.transform = `translateX(${offset}px)`;
    
      // Update opacity
      const leftTextOpacity = Math.max(0.3, percent / 100);
      document.querySelector('.text-section.right').style.opacity = leftTextOpacity;
    
      const rightTextOpacity = Math.max(0.1, (100 - percent) / 100);
      document.querySelector('.text-section.left').style.opacity = rightTextOpacity;
    };
    
    container.addEventListener("mousemove", handleMouseMove);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Theme transition animations
  useEffect(() => {
    setIsTransitioning(true);
    setShowBubble(true);
    setShowRipple(true);
    
    const timer1 = setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
    
    const timer2 = setTimeout(() => {
      setShowBubble(false);
    }, 1000);
    
    const timer3 = setTimeout(() => {
      setShowRipple(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isDarkMode]);

  return (
    <div className={`home-container ${isTransitioning ? 'theme-transitioning' : ''}`} ref={containerRef}>
      {/* Theme Ripple Animation */}
      {showRipple && (
        <div className="theme-ripple">
          <div className="ripple-circle ripple-1"></div>
          <div className="ripple-circle ripple-2"></div>
          <div className="ripple-circle ripple-3"></div>
        </div>
      )}

      {/* Theme Bubble Animation */}
      {showBubble && (
        <div className="theme-bubble">
          <div className="bubble-content">
            {isDarkMode ? "🌙" : "☀️"}
          </div>
        </div>
      )}

      <div className="text-section left" style={{ transition: 'opacity 0.3s ease' }}>
        <h1 className={isTransitioning ? 'theme-transitioning' : ''}>&lt;coder&gt;</h1>
        <p>Front end developer who writes clean, elegant and efficient code.</p>
      </div>

      <div className="interactive-image">
        <img
          src="/Images/Real.png" 
          className="color-image"
          ref={colorRef}
          alt="Designer Side"
        />
        <img
          src="/Images/Edited.png"
          className="bw"
          ref={bwRef}
          alt="Coder Side"
        />
      </div>

      <div className="text-section right" style={{ transition: 'opacity 0.3s ease' }}>
        <h1 className={isTransitioning ? 'theme-transitioning' : ''}>designer</h1>
        <p>Product designer specialising in UI design and design systems.</p>
        
        {/* Brush strokes background */}
        <div className="brush-strokes">
          <div className="brush-stroke stroke-1"></div>
          <div className="brush-stroke stroke-2"></div>
          <div className="brush-stroke stroke-3"></div>
          <div className="brush-stroke stroke-4"></div>
        </div>
      </div>
    </div>
  );
}
