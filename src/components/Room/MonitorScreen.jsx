import { useRef, useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import './MonitorScreen.css';

/**
 * Renders the live portfolio website (https://tejasthokal.netlify.app)
 * as an iframe directly on the 3D monitor surface using drei Html.
 *
 * Monitor inner bezel in the GLB (Node-Mesh_13):
 *   X [0.69482, 1.25715]  Y [0.23004, 0.59749]  back panel Z = -0.87869
 *   exact screen: 0.56233 × 0.36745, center [0.97599, 0.41377]
 */
// This GLB uses a single merged mesh, so we keep a stable anchor for the monitor display area.
const SCREEN_ANCHOR = {
  // Sized to fill the visible monitor opening (slightly larger than the back-panel
  // inner bezel so the website covers the recessed bezel walls visible from the camera).
  center: [0.960, 0.424, -0.8747],
  rotation: [0, 0, 0],
  size: [0.68, 0.46], // visible screen opening width × height
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
  const htmlScale = screenWidth / iframeWidthPx;

  return (
    <group>
      {/* Glow plane behind the iframe — simulates screen backlight */}
      <mesh
        position={SCREEN_ANCHOR.center}
        rotation={SCREEN_ANCHOR.rotation}
      >
        <planeGeometry args={[screenWidth, screenHeight]} />
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
          {/* Outer fit plane: matches full inner bezel */}
          <mesh position={[0, 0, 0.003]}>
            <planeGeometry args={[screenWidth, screenHeight]} />
            <meshBasicMaterial
              color="#22ff66"
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
            distanceFactor={400}
            position={[0, 0, 0.002]}
            scale={htmlScale}
            zIndexRange={[100, 0]}
            sprite={false}
            occlude={false}
            style={{
              width: `${iframeWidthPx}px`,
              height: `${iframeHeightPx}px`,
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
