import "./Facts.css";

export default function Facts({ isDarkMode }) {
  return (
    <div className="facts-container">
      <div className="facts-content">
        <div className="monitor-section">
          <div className="monitor">
            <div className="monitor-screen">
              <div className="yoda-container">
                <div className="yoda-character">
                  <img 
                    src="/Images/yoda.png" 
                    alt="Yoda" 
                    className="yoda-image"
                  />
                  <div className="lightsaber-container">
                    <div className="lightsaber">
                      <div className="lightsaber-blade"></div>
                      <div className="lightsaber-hilt"></div>
                    </div>
                  </div>
                </div>
                <div className="pandora-background">
                  <div className="floating-mountains">
                    <div className="mountain mountain-1"></div>
                    <div className="mountain mountain-2"></div>
                    <div className="mountain mountain-3"></div>
                  </div>
                  <div className="waterfalls">
                    <div className="waterfall waterfall-1"></div>
                    <div className="waterfall waterfall-2"></div>
                  </div>
                  <div className="clouds">
                    <div className="cloud cloud-1"></div>
                    <div className="cloud cloud-2"></div>
                    <div className="cloud cloud-3"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="monitor-stand"></div>
            <div className="apple-logo"></div>
          </div>
        </div>
        
        <div className="facts-text-section">
          <h1 className="facts-heading">Random facts</h1>
          <div className="facts-list">
            <p className="fact-item">
              I once redesigned a well-known app <span className="highlight">(IRCTC)</span> just for fun, focusing on improving user experience.
            </p>
            <p className="fact-item">
              I've been part of multiple college clubs like <span className="highlight">SAARC</span> and <span className="highlight">Hackathon Club</span>, where I contributed as a designer and organizer.
            </p>
            <p className="fact-item">
              I enjoy solving coding problems and have worked on projects like the <span className="highlight">N-Queens problem</span>, chatbots, and real-time web apps.
            </p>
            <p className="fact-item">
              I like blending creativity with logic — I do both web/app design and backend coding.
            </p>
            <p className="fact-item">
              I can switch from video editing to coding seamlessly, which makes my projects more interactive and polished.
            </p>
            <p className="fact-item">
              I once conducted alumni interviews and designed posters/events that connected juniors with experienced graduates.
            </p>
            <p className="fact-item">
              I'm currently exploring <span className="highlight">AI</span>, <span className="highlight">Three.js</span>, and <span className="highlight">MERN stack</span> to build unique, impactful projects.
            </p>
            <p className="fact-item">
              I love working on projects that solve real student problems — from academic support to career guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
