import './SkillsPanel.css';

const SKILLS = {
  Frontend: ['HTML', 'CSS', 'JavaScript', 'React'],
  Backend: ['Node.js', 'Express', 'MongoDB', 'SQL'],
  Tools: ['Git', 'Figma', 'Power BI', 'Three.js'],
};

export default function SkillsPanel({ onClose, isDarkMode }) {
  return (
    <div className={`modal-overlay ${isDarkMode ? 'dark' : ''}`} onClick={onClose}>
      <div className="skills-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="panel-title">My Skills</h2>
        <div className="skills-grid">
          {Object.entries(SKILLS).map(([category, skills]) => (
            <div key={category} className="skill-category">
              <h3>{category}</h3>
              <div className="skill-list">
                {skills.map((skill) => (
                  <div key={skill} className="skill-item">
                    <span className="skill-dot"></span>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
