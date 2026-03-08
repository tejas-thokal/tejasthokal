import { useState } from 'react';
import './PortfolioScreen.css';

const TABS = ['Home', 'About', 'Projects', 'Skills', 'Resume', 'Contact'];

export default function PortfolioScreen({ onClose, isDarkMode }) {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <div className={`portfolio-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="screen-chrome">
        <div className="screen-dots">
          <span className="dot red" onClick={onClose} title="Close"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <span className="screen-title">tejas@portfolio:~</span>
      </div>

      <nav className="screen-nav">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`screen-nav-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="screen-content">
        {activeTab === 'Home' && <ScreenHome />}
        {activeTab === 'About' && <ScreenAbout />}
        {activeTab === 'Projects' && <ScreenProjects />}
        {activeTab === 'Skills' && <ScreenSkills />}
        {activeTab === 'Resume' && <ScreenResume />}
        {activeTab === 'Contact' && <ScreenContact />}
      </div>
    </div>
  );
}

function ScreenHome() {
  return (
    <div className="tab-content home-tab">
      <h1>Tejas Thokal</h1>
      <p className="tagline">Frontend Developer &bull; MERN Stack &bull; Creative Designer</p>
      <p>Building digital experiences that blend creativity with functionality.</p>
      <div className="home-stats">
        <div className="stat">
          <span className="stat-number">10+</span>
          <span className="stat-label">Projects</span>
        </div>
        <div className="stat">
          <span className="stat-number">3+</span>
          <span className="stat-label">Years Coding</span>
        </div>
        <div className="stat">
          <span className="stat-number">5+</span>
          <span className="stat-label">Technologies</span>
        </div>
      </div>
    </div>
  );
}

function ScreenAbout() {
  return (
    <div className="tab-content about-tab">
      <h2>About Me</h2>
      <p>
        I'm Tejas Thokal, a developer and designer passionate about building
        digital experiences. Skilled in MERN stack, Java, and C++, I love
        turning ideas into real-world projects — from AI-powered apps to modern
        UI/UX designs.
      </p>
      <p>Always curious, always learning, and always creating.</p>
    </div>
  );
}

function ScreenProjects() {
  const projects = [
    { name: 'Airbnb Clone', tech: 'React, Node.js, MongoDB' },
    { name: 'AI Chat App', tech: 'React, OpenAI API, Express' },
    { name: 'Dashboard Project', tech: 'React, Chart.js, Firebase' },
  ];
  return (
    <div className="tab-content projects-tab">
      <h2>Projects</h2>
      <div className="project-list">
        {projects.map((p, i) => (
          <div key={i} className="project-card-mini">
            <h3>{p.name}</h3>
            <p>{p.tech}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenSkills() {
  return (
    <div className="tab-content skills-tab">
      <h2>Skills</h2>
      <div className="skill-groups-mini">
        <div>
          <h4>Frontend</h4>
          <p>HTML, CSS, JavaScript, React</p>
        </div>
        <div>
          <h4>Backend</h4>
          <p>Node.js, Express, MongoDB, SQL</p>
        </div>
        <div>
          <h4>Tools</h4>
          <p>Git, Figma, Three.js, Power BI</p>
        </div>
      </div>
    </div>
  );
}

function ScreenResume() {
  return (
    <div className="tab-content resume-tab">
      <h2>Resume</h2>
      <div className="resume-entry">
        <h4>Education</h4>
        <p>B.Tech in Computer Science</p>
      </div>
      <div className="resume-entry">
        <h4>Experience</h4>
        <p>Frontend Developer | MERN Stack Projects</p>
      </div>
      <a
        className="resume-download"
        href="#"
        onClick={(e) => e.preventDefault()}
      >
        Download Resume (PDF)
      </a>
    </div>
  );
}

function ScreenContact() {
  return (
    <div className="tab-content contact-tab">
      <h2>Contact</h2>
      <div className="contact-links">
        <a href="mailto:tejasthokal@gmail.com">
          Email: tejasthokal@gmail.com
        </a>
        <a href="https://linkedin.com/in/tejasthokal" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href="https://github.com/tejasthokal" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </div>
  );
}
