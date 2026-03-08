import { useState, useCallback, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import RoomScene from './components/Room/RoomScene';
import InteractiveObjects from './components/Room/InteractiveObjects';
import CameraController from './components/Room/CameraController';
import ProjectModal from './ui/ProjectModal';

import TimelineModal from './ui/TimelineModal';
import ContactPanel from './ui/ContactPanel';
import LoadingScreen from './ui/LoadingScreen';
import './Experience.css';

export default function Experience({ isDarkMode, toggleTheme }) {
  const [activeObject, setActiveObject] = useState(null);
  const [focusTarget, setFocusTarget] = useState(null);
  const [showUI, setShowUI] = useState(null);
  const [hoveredObject, setHoveredObject] = useState(null);
  const [nightMode, setNightMode] = useState(false);
  const [modelNodes, setModelNodes] = useState(null);
  const [monitorActive, setMonitorActive] = useState(false);
  const suitcaseClickCount = useRef(0);
  const suitcaseTimer = useRef(null);
  const activeObjectRef = useRef(null);

  const handleObjectClick = useCallback(
    (name, focus) => {
      // Easter egg: double-click suitcase
      if (name === 'suitcase') {
        suitcaseClickCount.current += 1;
        if (suitcaseClickCount.current === 2) {
          suitcaseClickCount.current = 0;
          clearTimeout(suitcaseTimer.current);
          window.open('https://github.com/tejasthokal', '_blank');
          return;
        }
        suitcaseTimer.current = setTimeout(() => {
          suitcaseClickCount.current = 0;
        }, 400);
      }

      // Easter egg: bed -> night mode
      if (name === 'bed') {
        setNightMode((prev) => !prev);
        return;
      }

      // Easter egg: lamp -> dark mode toggle
      if (name === 'lamp') {
        toggleTheme();
        return;
      }

      // Easter egg: keyboard -> typing sound
      if (name === 'keyboard') {
        playTypingSound();
        return;
      }

      setActiveObject(name);
      activeObjectRef.current = name;
      setFocusTarget(focus);

      // Monitor: activate in-scene iframe instead of modal
      if (name === 'monitor') {
        setMonitorActive(true);
      }
    },
    [toggleTheme]
  );

  const handleCameraAnimationComplete = useCallback(() => {
    const current = activeObjectRef.current;
    if (current && current !== 'monitor') {
      setShowUI(current);
    }
  }, []);

  const handleClose = useCallback(() => {
    setShowUI(null);
    setActiveObject(null);
    activeObjectRef.current = null;
    setFocusTarget(null);
    setMonitorActive(false);
  }, []);

  const handleModelLoaded = useCallback((nodes) => {
    setModelNodes(nodes);
  }, []);

  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className={`experience-container ${isDarkMode ? 'dark' : ''}`}>
      <Canvas
        shadows
        camera={{ position: [5, 5, 5], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
      >
        <color
          attach="background"
          args={[isDarkMode || nightMode ? '#0a0a0f' : '#e8ecf1']}
        />
        <fog
          attach="fog"
          args={[isDarkMode || nightMode ? '#0a0a0f' : '#e8ecf1', 8, 20]}
        />

        <Suspense
          fallback={
            <Html center>
              <LoadingScreen />
            </Html>
          }
        >
          <RoomScene
            isDarkMode={isDarkMode}
            nightMode={nightMode}
            onModelLoaded={handleModelLoaded}
            monitorActive={monitorActive}
          />
          <InteractiveObjects
            onObjectClick={handleObjectClick}
            onObjectHover={setHoveredObject}
            modelNodes={modelNodes}
          />
        </Suspense>

        <CameraController
          focusTarget={focusTarget}
          onAnimationComplete={handleCameraAnimationComplete}
        />
      </Canvas>

      {/* Loading overlay outside Canvas */}
      <LoadingScreen />

      {/* Hover tooltip */}
      {hoveredObject && !showUI && !monitorActive && (
        <div className="hover-tooltip">
          {getTooltipText(hoveredObject)}
        </div>
      )}

      {/* Mobile hint */}
      {isMobile && !showUI && !activeObject && (
        <div className="mobile-hint">Tap objects to explore</div>
      )}

      {/* Back button when focused on anything */}
      {(showUI || monitorActive) && (
        <button className="back-button" onClick={handleClose}>
          &larr; Back
        </button>
      )}

      {/* UI Overlays (non-monitor objects) */}
      {(showUI === 'frame1' ||
        showUI === 'frame2' ||
        showUI === 'frame3') && (
        <ProjectModal
          projectId={showUI}
          onClose={handleClose}
          isDarkMode={isDarkMode}
        />
      )}
      {showUI === 'suitcase' && (
        <TimelineModal onClose={handleClose} isDarkMode={isDarkMode} />
      )}
      {showUI === 'window' && (
        <ContactPanel onClose={handleClose} isDarkMode={isDarkMode} />
      )}

      {/* Night mode indicator */}
      {nightMode && <div className="night-indicator">Night Mode</div>}
    </div>
  );
}

function getTooltipText(name) {
  const tooltips = {
    monitor: 'Click to view Portfolio',
    frame1: 'Airbnb Clone Project',
    frame2: 'AI Chat App Project',
    frame3: 'Dashboard Project',
    suitcase: 'My Journey',
    lamp: 'Toggle Dark Mode',
    window: 'Contact Me',
    bed: 'Toggle Night Mode',
    keyboard: 'Type!',
  };
  return tooltips[name] || name;
}

function playTypingSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playKey = (time) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800 + Math.random() * 400;
      osc.type = 'square';
      gain.gain.value = 0.03;
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
      osc.start(time);
      osc.stop(time + 0.05);
    };
    for (let i = 0; i < 6; i++) {
      playKey(ctx.currentTime + i * 0.08);
    }
  } catch {
    // Audio not supported, ignore silently
  }
}
