import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Camera positions for each interactive object
const FOCUS_POSITIONS = {
  monitor: {
    position: [0.77, 0.55, 0.8],
    lookAt: [0.77, 0.35, -0.685],
  },
  frame1: {
    position: [-2, 2.5, 2],
    lookAt: [-3, 2.5, 0],
  },
  frame2: {
    position: [0, 2.5, 2],
    lookAt: [0, 2.5, -1],
  },
  frame3: {
    position: [2, 2.5, 2],
    lookAt: [3, 2.5, 0],
  },
  books: {
    position: [2, 2, 3],
    lookAt: [1.5, 1.2, 0],
  },
  suitcase: {
    position: [3, 1.5, 3],
    lookAt: [2, 0.5, 1],
  },
  lamp: {
    position: [1, 3, 3],
    lookAt: [0, 2.5, 0],
  },
  window: {
    position: [-1, 2.5, 3],
    lookAt: [-2, 2, -1],
  },
  bed: {
    position: [3, 3, 3],
    lookAt: [2, 0.8, -1],
  },
  keyboard: {
    position: [0.3, 2.2, 2.5],
    lookAt: [0, 1.4, 0],
  },
};

function InteractiveHitbox({ name, position, size, onClick, onHover }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const glowRef = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = hovered ? 1 : 0;
    glowRef.current += (target - glowRef.current) * delta * 5;
    meshRef.current.material.opacity = glowRef.current * 0.15;
    const scale = 1 + glowRef.current * 0.05;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick(name);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
        if (onHover) onHover(name);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'default';
        if (onHover) onHover(null);
      }}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        color="#4fc3f7"
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function InteractiveObjects({
  onObjectClick,
  onObjectHover,
  modelNodes,
}) {
  // Compute bounding boxes from actual model nodes when available
  const hitboxes = useMemo(() => {
    const defaults = [
      { name: 'monitor', position: [0.77, 0.35, -0.685], size: [0.95, 0.50, 0.15] },
      { name: 'frame1', position: [-2.4, 2.6, -1.5], size: [0.6, 0.5, 0.1] },
      { name: 'frame2', position: [-1.2, 2.6, -1.5], size: [0.6, 0.5, 0.1] },
      { name: 'frame3', position: [0, 2.6, -1.5], size: [0.6, 0.5, 0.1] },
      { name: 'books', position: [1.5, 1.3, 0.3], size: [0.4, 0.3, 0.3] },
      { name: 'suitcase', position: [2.2, 0.3, 1.2], size: [0.5, 0.4, 0.3] },
      { name: 'lamp', position: [-0.8, 2.2, 0.3], size: [0.3, 0.4, 0.3] },
      { name: 'window', position: [-2.5, 2, -0.5], size: [0.1, 1, 0.8] },
      { name: 'bed', position: [2, 0.6, -1], size: [1.2, 0.5, 1.5] },
      { name: 'keyboard', position: [0, 1.4, 0.5], size: [0.5, 0.05, 0.2] },
    ];

    if (!modelNodes) return defaults;

    // Try to compute positions from model nodes
    return defaults.map((hitbox) => {
      const node = findNodeByHint(modelNodes, hitbox.name);
      if (node && node.geometry) {
        const box = new THREE.Box3().setFromObject(node);
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        box.getCenter(center);
        box.getSize(size);
        return {
          ...hitbox,
          position: [center.x, center.y, center.z],
          size: [
            Math.max(size.x, 0.3),
            Math.max(size.y, 0.3),
            Math.max(size.z, 0.1),
          ],
        };
      }
      return hitbox;
    });
  }, [modelNodes]);

  const handleClick = (name) => {
    const focus = FOCUS_POSITIONS[name];
    onObjectClick(name, focus);
  };

  return (
    <group>
      {hitboxes.map((hb) => (
        <InteractiveHitbox
          key={hb.name}
          name={hb.name}
          position={hb.position}
          size={hb.size}
          onClick={handleClick}
          onHover={onObjectHover}
        />
      ))}
    </group>
  );
}

// Utility to match model nodes by name hints
function findNodeByHint(nodes, hint) {
  if (!nodes) return null;
  const hints = {
    monitor: ['monitor', 'screen', 'display', 'computer'],
    frame1: ['frame', 'picture', 'poster'],
    frame2: ['frame', 'picture', 'poster'],
    frame3: ['frame', 'picture', 'poster'],
    books: ['book', 'shelf'],
    suitcase: ['suitcase', 'luggage', 'bag', 'case'],
    lamp: ['lamp', 'light'],
    window: ['window'],
    bed: ['bed', 'mattress'],
    keyboard: ['keyboard', 'keys'],
  };

  const keywords = hints[hint] || [hint];
  for (const [, node] of Object.entries(nodes)) {
    if (node && node.name) {
      const nameLower = node.name.toLowerCase();
      if (keywords.some((k) => nameLower.includes(k))) {
        return node;
      }
    }
  }
  return null;
}

export { FOCUS_POSITIONS };
