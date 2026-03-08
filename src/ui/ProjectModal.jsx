import './ProjectModal.css';

const PROJECTS = [
  {
    id: 'frame1',
    title: 'Airbnb Clone',
    description:
      'A full-stack Airbnb clone with user authentication, listing management, reviews, and an interactive map-based search experience.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Mapbox'],
    github: 'https://github.com/tejasthokal',
    demo: '#',
  },
  {
    id: 'frame2',
    title: 'AI Chat App',
    description:
      'An intelligent chatbot application powered by OpenAI API with real-time conversation, context memory, and a sleek modern UI.',
    tech: ['React', 'OpenAI API', 'Express', 'Socket.io'],
    github: 'https://github.com/tejasthokal',
    demo: '#',
  },
  {
    id: 'frame3',
    title: 'Dashboard Project',
    description:
      'An analytics dashboard with real-time data visualizations, responsive charts, and a clean, data-driven interface.',
    tech: ['React', 'Chart.js', 'Firebase', 'Tailwind CSS'],
    github: 'https://github.com/tejasthokal',
    demo: '#',
  },
];

export default function ProjectModal({ projectId, onClose, isDarkMode }) {
  const project = PROJECTS.find((p) => p.id === projectId);
  if (!project) return null;

  return (
    <div className={`modal-overlay ${isDarkMode ? 'dark' : ''}`} onClick={onClose}>
      <div className="project-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">{project.title}</h2>
        <p className="modal-desc">{project.description}</p>
        <div className="modal-tech">
          {project.tech.map((t) => (
            <span key={t} className="tech-badge">
              {t}
            </span>
          ))}
        </div>
        <div className="modal-links">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-btn github"
          >
            GitHub
          </a>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-btn demo"
          >
            Live Demo
          </a>
        </div>
      </div>
    </div>
  );
}
