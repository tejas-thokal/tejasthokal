import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';

const DEFAULT_CAMERA = {
  position: [5, 5, 5],
  target: [0, 1, 0],
  fov: 45,
};

export default function CameraController({ focusTarget, onAnimationComplete }) {
  const controlsRef = useRef();
  const { camera } = useThree();
  const isAnimating = useRef(false);
  const floatTime = useRef(0);
  const baseY = useRef(DEFAULT_CAMERA.position[1]);
  const controlsTarget = useRef({
    x: DEFAULT_CAMERA.target[0],
    y: DEFAULT_CAMERA.target[1],
    z: DEFAULT_CAMERA.target[2],
  });

  // Subtle idle float
  useFrame((_, delta) => {
    if (!isAnimating.current && !focusTarget) {
      floatTime.current += delta;
      const floatOffset = Math.sin(floatTime.current * 0.5) * 0.05;
      camera.position.y = baseY.current + floatOffset;
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(
        controlsTarget.current.x,
        controlsTarget.current.y,
        controlsTarget.current.z
      );
      controlsRef.current.update();
    }
  });

  useEffect(() => {
    if (focusTarget) {
      isAnimating.current = true;
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }

      const { position, lookAt } = focusTarget;
      const focusFov = focusTarget.fov ?? DEFAULT_CAMERA.fov;

      gsap.to(camera.position, {
        x: position[0],
        y: position[1],
        z: position[2],
        duration: 1.35,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
        },
        onComplete: () => {
          isAnimating.current = false;
          camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
          if (onAnimationComplete) onAnimationComplete();
        },
      });

      gsap.to(camera, {
        fov: focusFov,
        duration: 1.35,
        ease: 'power2.inOut',
        onUpdate: () => camera.updateProjectionMatrix(),
      });

      gsap.to(controlsTarget.current, {
        x: lookAt[0],
        y: lookAt[1],
        z: lookAt[2],
        duration: 1.35,
        ease: 'power2.inOut',
      });
    } else {
      // Return to default
      isAnimating.current = true;
      gsap.to(camera.position, {
        x: DEFAULT_CAMERA.position[0],
        y: DEFAULT_CAMERA.position[1],
        z: DEFAULT_CAMERA.position[2],
        duration: 1.0,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.lookAt(
            DEFAULT_CAMERA.target[0],
            DEFAULT_CAMERA.target[1],
            DEFAULT_CAMERA.target[2]
          );
        },
        onComplete: () => {
          isAnimating.current = false;
          baseY.current = camera.position.y;
          if (controlsRef.current) {
            controlsRef.current.enabled = true;
            controlsRef.current.target.set(
              DEFAULT_CAMERA.target[0],
              DEFAULT_CAMERA.target[1],
              DEFAULT_CAMERA.target[2]
            );
          }
        },
      });

      gsap.to(camera, {
        fov: DEFAULT_CAMERA.fov,
        duration: 1.0,
        ease: 'power2.inOut',
        onUpdate: () => camera.updateProjectionMatrix(),
      });

      gsap.to(controlsTarget.current, {
        x: DEFAULT_CAMERA.target[0],
        y: DEFAULT_CAMERA.target[1],
        z: DEFAULT_CAMERA.target[2],
        duration: 1.0,
        ease: 'power2.inOut',
      });
    }
  }, [focusTarget, camera, onAnimationComplete]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      minDistance={3}
      maxDistance={10}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.5}
      minAzimuthAngle={-Math.PI / 4}
      maxAzimuthAngle={Math.PI / 4}
      target={DEFAULT_CAMERA.target}
    />
  );
}
