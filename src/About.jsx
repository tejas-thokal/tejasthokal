import "./About.css";
import Facts from "./Facts.jsx";

export default function About({ isDarkMode }) {
  return (
    <>
      <div className="about-container">
        <div className="about-content">
          <div className="about-text">
            <h1 className="about-heading">about.</h1>
            <div className="about-description">
              <p className="about-intro">
                I'm Tejas Thokal, a developer and designer passionate about building digital experiences that blend creativity with functionality.
              </p>
              <p className="about-details">
                Skilled in MERN stack, Java, and C++, I love turning ideas into real-world projects — from AI-powered apps to modern UI/UX designs. Always curious, always learning, and always creating.
              </p>
            </div>
          </div>
          
          <div className="about-image-section">
            <div className="image-container">
              <img 
                src="/Images/Real.jpg" 
                alt="Tejas Thokal" 
                className="about-image"
              />
            </div>
            <div className="brush-strokes">
              <div className="brush-stroke brush-1"></div>
              <div className="brush-stroke brush-2"></div>
              <div className="brush-stroke brush-3"></div>
              <div className="brush-stroke brush-4"></div>
            </div>
          </div>
        </div>
      </div>
      
      <Facts isDarkMode={isDarkMode} />
    </>
  );
}
