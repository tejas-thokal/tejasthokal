import { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import MonitorScreen from './MonitorScreen';

export default function RoomScene({ isDarkMode, nightMode, onModelLoaded, monitorActive }) {
  const { scene, nodes } = useGLTF('/models/room.glb');
  const roomRef = useRef();
  const lightRef = useRef();
  const pointLightRef = useRef();

  // Report nodes once loaded
  useMemo(() => {
    if (nodes && onModelLoaded) {
      onModelLoaded(nodes);
    }
  }, [nodes, onModelLoaded]);

  // Ensure all meshes receive and cast shadows
  useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // Animate lighting based on mode
  useFrame((_, delta) => {
    if (lightRef.current) {
      const targetIntensity = nightMode ? 0.15 : isDarkMode ? 0.4 : 0.8;
      lightRef.current.intensity +=
        (targetIntensity - lightRef.current.intensity) * delta * 2;
    }
    if (pointLightRef.current) {
      const targetIntensity = nightMode ? 0.3 : isDarkMode ? 0.6 : 1.0;
      pointLightRef.current.intensity +=
        (targetIntensity - pointLightRef.current.intensity) * delta * 2;

      // Warm lamp glow in night mode
      if (nightMode) {
        pointLightRef.current.color.lerp(
          new THREE.Color('#ff9800'),
          delta * 2
        );
      } else {
        pointLightRef.current.color.lerp(
          new THREE.Color('#ffffff'),
          delta * 2
        );
      }
    }
  });

  return (
    <group ref={roomRef}>
      {/* Ambient light */}
      <ambientLight
        ref={lightRef}
        intensity={isDarkMode ? 0.4 : 0.8}
        color={nightMode ? '#1a237e' : '#ffffff'}
      />

      {/* Main directional light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={isDarkMode ? 0.3 : 0.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />

      {/* Point light (lamp / room light) */}
      <pointLight
        ref={pointLightRef}
        position={[-0.8, 2.8, 0.3]}
        intensity={1.0}
        distance={8}
        decay={2}
        castShadow
      />

      {/* Monitor screen glow */}
      <pointLight
        position={[0, 1.8, 0.4]}
        intensity={0.4}
        distance={2}
        color="#4fc3f7"
        decay={2}
      />

      {/* The 3D model */}
      <primitive object={scene} scale={1} position={[0, 0, 0]} />

      {/* Portfolio website rendered on the monitor screen */}
      <MonitorScreen active={monitorActive} isDarkMode={isDarkMode} />
    </group>
  );
}

useGLTF.preload('/models/room.glb');
