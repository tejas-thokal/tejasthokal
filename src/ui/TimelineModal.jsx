import './TimelineModal.css';

const TIMELINE = [
  {
    year: '2023',
    title: 'Started Coding',
    description: 'Began my programming journey with HTML, CSS, and JavaScript.',
  },
  {
    year: '2024',
    title: 'Learned MERN Stack',
    description:
      'Deep-dived into MongoDB, Express, React, and Node.js. Built multiple full-stack projects.',
  },
  {
    year: '2025',
    title: 'Built AI & Web Projects',
    description:
      'Created AI-powered applications and advanced frontend experiences with Three.js.',
  },
  {
    year: '2026',
    title: 'Seeking Software Engineering Roles',
    description:
      'Looking for opportunities to create impactful software at scale.',
  },
];

export default function TimelineModal({ onClose, isDarkMode }) {
  return (
    <div className={`modal-overlay ${isDarkMode ? 'dark' : ''}`} onClick={onClose}>
      <div className="timeline-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="timeline-title">My Journey</h2>
        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-marker">
                <span className="timeline-year">{item.year}</span>
                <span className="timeline-dot"></span>
              </div>
              <div className="timeline-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
