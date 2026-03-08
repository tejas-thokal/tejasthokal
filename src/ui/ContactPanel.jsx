import './ContactPanel.css';

const CONTACTS = [
  {
    label: 'Email',
    icon: '✉',
    href: 'mailto:tejasthokal@gmail.com',
    text: 'tejasthokal@gmail.com',
  },
  {
    label: 'LinkedIn',
    icon: 'in',
    href: 'https://linkedin.com/in/tejasthokal',
    text: 'linkedin.com/in/tejasthokal',
  },
  {
    label: 'GitHub',
    icon: '⌨',
    href: 'https://github.com/tejasthokal',
    text: 'github.com/tejasthokal',
  },
];

export default function ContactPanel({ onClose, isDarkMode }) {
  return (
    <div className={`modal-overlay ${isDarkMode ? 'dark' : ''}`} onClick={onClose}>
      <div className="contact-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="contact-title">Get In Touch</h2>
        <div className="contact-list">
          {CONTACTS.map((c) => (
            <a
              key={c.label}
              className="contact-card"
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-icon">{c.icon}</span>
              <div>
                <span className="contact-label">{c.label}</span>
                <span className="contact-text">{c.text}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
