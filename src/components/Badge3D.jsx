import { Canvas } from '@react-three/fiber';
import { Float, useTexture } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MouseFollowBadge = ({ 
  children, 
  mouseIntensity = 0.05, 
  floatIntensity = 1,
  positionIntensity = 0.5,
  initialPosition = [0, 0, 0]
}) => {
  const ref = useRef();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  useFrame((state) => {
    if (ref.current) {
      const { mouse } = state;
      // Subtle rotation based on mouse
      ref.current.rotation.x = mouse.y * mouseIntensity;
      ref.current.rotation.y = mouse.x * mouseIntensity;
      
      // Subtle position offset based on mouse
      const targetX = initialPosition[0] + (mousePos.x * positionIntensity);
      const targetY = initialPosition[1] + (mousePos.y * positionIntensity);
      
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX, 0.02);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, 0.02);
    }
  });
  
  return (
    <Float speed={0.8} rotationIntensity={floatIntensity} floatIntensity={floatIntensity}>
      <group ref={ref} position={initialPosition}>
        {children}
      </group>
    </Float>
  );
};

const Badge = ({ textureUrl = 'textures/aws-educate-CC101.png', scale = 1 }) => {
  const meshRef = useRef();
  
  // Load texture for the badge
  const badgeTexture = useTexture(textureUrl);
  
  // Create geometry for the badge with proper thickness
  const geometry = new THREE.BoxGeometry(2.4 * scale, 2.9 * scale, 0.2 * scale);
  const edges = new THREE.EdgesGeometry(geometry);
  
  return (
    <group>
      {/* Main badge mesh */}
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          map={badgeTexture}
          roughness={0.3}
          metalness={0.1}
          clearcoat={0.2}
          clearcoatRoughness={0.8}
          reflectivity={0.1}
          envMapIntensity={0.3}
        />
      </mesh>
      
      {/* Subtle edge highlight for depth */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#444444" opacity={0.1} transparent />
      </lineSegments>
    </group>
  );
};

export { MouseFollowBadge, Badge };
