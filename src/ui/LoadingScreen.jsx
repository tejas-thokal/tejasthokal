import { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import './LoadingScreen.css';

export default function LoadingScreen() {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active && progress >= 100) {
      const timer = setTimeout(() => setVisible(false), 800);
      return () => clearTimeout(timer);
    }
  }, [active, progress]);

  if (!visible) return null;

  const done = !active && progress >= 100;

  return (
    <div className={`loading-screen ${done ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <h1 className="loading-title">Loading Tejas's Workspace...</h1>
        <div className="loading-bar-container">
          <div
            className="loading-bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="loading-percent">{Math.round(progress)}%</span>
        <p className="loading-hint">Explore by clicking objects in the room</p>
      </div>
    </div>
  );
}
