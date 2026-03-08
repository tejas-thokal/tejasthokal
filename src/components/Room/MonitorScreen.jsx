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

  return (
    <group>
      {/* Glow plane behind the iframe — simulates screen backlight */}
      <mesh position={[0.77, 0.35, -0.686]}>
        <planeGeometry args={[0.92, 0.48]} />
        <meshStandardMaterial
          ref={glowRef}
          color="#0a0a14"
          emissive="#4fc3f7"
          emissiveIntensity={0.02}
          toneMapped={false}
        />
      </mesh>

      {/* The iframe rendered on the monitor surface via Html transform */}
      {screenOn && (
        <Html
          transform
          position={[0.77, 0.35, -0.682]}
          rotation={[0, 0, 0]}
          scale={0.044}
          zIndexRange={[100, 0]}
          sprite={false}
          style={{
            width: '1024px',
            height: '576px',
            borderRadius: '6px',
            overflow: 'hidden',
            background: '#000',
            pointerEvents: 'auto',
          }}
        >
          <div
            className="monitor-iframe-container"
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
      )}
    </group>
  );
}
