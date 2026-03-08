import { useRef, useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import './MonitorScreen.css';

/**
 * Renders the live portfolio website (https://tejasthokal.netlify.app)
 * as an iframe directly on the 3D monitor surface using drei Html.
 *
 * Monitor screen in the GLB is approximately at:
 *   center: [0.77, 0.35, -0.685]
 *   size:   ~0.97 x 0.50
 */
// This GLB uses a single merged mesh, so we keep a stable anchor for the monitor display area.
const SCREEN_ANCHOR = {
  center: [0.77, 0.35, -0.684],
  rotation: [0, 0, 0],
  size: [0.885, 0.498], // 16:9 display area fitted to current monitor frame
};

// Temporary calibration overlay. Keep false in normal runtime.
const SHOW_SCREEN_DEBUG = false;

export default function MonitorScreen({ active, isDarkMode }) {
  const glowRef = useRef();
  const [screenOn, setScreenOn] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (active) {
      // Delay to let camera zoom finish before showing screen
      const timer = setTimeout(() => setScreenOn(true), 600);
      return () => clearTimeout(timer);
    } else {
      setScreenOn(false);
      setIframeLoaded(false);
    }
  }, [active]);

  // Animate the glow plane behind the screen
  useFrame((_, delta) => {
    if (glowRef.current) {
      const target = screenOn ? 0.5 : 0.02;
      glowRef.current.emissiveIntensity +=
        (target - glowRef.current.emissiveIntensity) * delta * 4;
    }
  });

  const [screenWidth, screenHeight] = SCREEN_ANCHOR.size;
  const aspect = screenWidth / screenHeight;

  // Keep pixel ratio matched to the actual monitor aspect, then map pixels -> world units.
  const iframeWidthPx = 1600;
  const iframeHeightPx = Math.round(iframeWidthPx / aspect);
  const htmlScale = (screenWidth * 0.985) / iframeWidthPx;

  return (
    <group>
      {/* Glow plane behind the iframe — simulates screen backlight */}
      <mesh
        position={SCREEN_ANCHOR.center}
        rotation={SCREEN_ANCHOR.rotation}
      >
        <planeGeometry args={[screenWidth * 0.985, screenHeight * 0.985]} />
        <meshStandardMaterial
          ref={glowRef}
          color="#0a0a14"
          emissive="#4fc3f7"
          emissiveIntensity={0.02}
          toneMapped={false}
        />
      </mesh>

      {SHOW_SCREEN_DEBUG && (
        <group position={SCREEN_ANCHOR.center} rotation={SCREEN_ANCHOR.rotation}>
          {/* Outer fit plane: use this to verify bezel fit visually */}
          <mesh position={[0, 0, 0.013]}>
            <planeGeometry args={[screenWidth, screenHeight]} />
            <meshBasicMaterial
              color="#22ff66"
              wireframe
              transparent
              opacity={0.65}
              toneMapped={false}
            />
          </mesh>

          {/* Active content plane: matches actual Html area */}
          <mesh position={[0, 0, 0.014]}>
            <planeGeometry args={[screenWidth * 0.985, screenHeight * 0.985]} />
            <meshBasicMaterial
              color="#00b7ff"
              wireframe
              transparent
              opacity={0.65}
              toneMapped={false}
            />
          </mesh>
        </group>
      )}

      {/* The iframe rendered on the monitor surface via Html transform */}
      {screenOn && (
        <group
          position={SCREEN_ANCHOR.center}
          rotation={SCREEN_ANCHOR.rotation}
        >
          <Html
            transform
            position={[0, 0, 0.01]}
            scale={htmlScale}
            distanceFactor={1}
            zIndexRange={[100, 0]}
            sprite={false}
            occlude={false}
            style={{
              width: `${iframeWidthPx}px`,
              height: `${iframeHeightPx}px`,
              borderRadius: '6px',
              overflow: 'hidden',
              background: '#000',
              pointerEvents: 'auto',
            }}
          >
            <div
              className="monitor-iframe-container"
              style={{ width: `${iframeWidthPx}px`, height: `${iframeHeightPx}px` }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Scanline CRT overlay for realism */}
              <div className="monitor-scanline"></div>

              {/* Loading indicator shown until iframe loads */}
              {!iframeLoaded && (
                <div className="monitor-boot">
                  <div className="monitor-boot-text">Booting up...</div>
                </div>
              )}

              {/* The actual live website */}
              <iframe
                src="https://tejasthokal.netlify.app"
                title="Tejas Thokal Portfolio"
                className="monitor-iframe"
                onLoad={() => setIframeLoaded(true)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                style={{
                  opacity: iframeLoaded ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                }}
              />
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}
