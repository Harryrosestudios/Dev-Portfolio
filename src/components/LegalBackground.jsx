import { Canvas } from '@react-three/fiber';
import { Float, Sphere, Box, Torus, Cone, Octahedron } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MouseFollowShape = ({ 
  children, 
  mouseIntensity = 0.1, 
  floatIntensity = 2,
  positionIntensity = 1,
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
      // Rotation based on mouse
      ref.current.rotation.x = mouse.y * mouseIntensity;
      ref.current.rotation.y = mouse.x * mouseIntensity;
      
      // Position offset based on mouse
      const targetX = initialPosition[0] + (mousePos.x * positionIntensity);
      const targetY = initialPosition[1] + (mousePos.y * positionIntensity);
      
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX, 0.05);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, 0.05);
    }
  });
  
  return (
    <Float speed={1.5} rotationIntensity={floatIntensity} floatIntensity={floatIntensity}>
      <group ref={ref} position={initialPosition}>
        {children}
      </group>
    </Float>
  );
};

const LegalBackground = () => {
  return (
    <>
      {/* Background shapes - behind content */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 20], fov: 50 }} style={{ pointerEvents: 'none' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        
        {/* Left side shapes */}
        <MouseFollowShape 
          mouseIntensity={0.2} 
          floatIntensity={3}
          positionIntensity={1.5}
          initialPosition={[-8, 3, 0]}
        >
          <Sphere args={[1.5, 32, 32]}>
            <meshStandardMaterial 
              color="#60f5a1" 
              emissive="#60f5a1"
              emissiveIntensity={0.2}
              roughness={0.3} 
              metalness={0.8}
              opacity={0.6}
              transparent
            />
          </Sphere>
        </MouseFollowShape>
        
        <MouseFollowShape 
          mouseIntensity={0.15} 
          floatIntensity={2}
          positionIntensity={0.8}
          initialPosition={[-9, -2, -2]}
        >
          <Box args={[2, 2, 2]} rotation={[0.4, 0.2, 0]}>
            <meshStandardMaterial 
              color="#635BFF" 
              emissive="#635BFF"
              emissiveIntensity={0.1}
              roughness={0.4} 
              metalness={0.6}
              opacity={0.5}
              transparent
            />
          </Box>
        </MouseFollowShape>
        
        {/* Right side shapes */}
        <MouseFollowShape 
          mouseIntensity={0.25} 
          floatIntensity={2.5}
          positionIntensity={2}
          initialPosition={[8, 2, -1]}
        >
          <Torus args={[1.5, 0.6, 16, 32]} rotation={[0.3, 0.5, 0]}>
            <meshStandardMaterial 
              color="#FF6B6B" 
              emissive="#FF6B6B"
              emissiveIntensity={0.15}
              roughness={0.3} 
              metalness={0.7}
              opacity={0.5}
              transparent
            />
          </Torus>
        </MouseFollowShape>
        
        <MouseFollowShape 
          mouseIntensity={0.18} 
          floatIntensity={1.8}
          positionIntensity={1.2}
          initialPosition={[9, -3, 1]}
        >
          <Cone args={[1.2, 2.5, 6]} rotation={[0, 0, 0.3]}>
            <meshStandardMaterial 
              color="#4ECDC4" 
              emissive="#4ECDC4"
              emissiveIntensity={0.2}
              roughness={0.4} 
              metalness={0.5}
              opacity={0.6}
              transparent
            />
          </Cone>
        </MouseFollowShape>
        
        {/* Additional floating elements */}
        <MouseFollowShape 
          mouseIntensity={0.3} 
          floatIntensity={4}
          positionIntensity={2.5}
          initialPosition={[6, -5, 2]}
        >
          <Sphere args={[0.8, 16, 16]}>
            <meshStandardMaterial 
              color="#FFE66D" 
              emissive="#FFE66D"
              emissiveIntensity={0.3}
              roughness={0.2} 
              metalness={0.9}
              opacity={0.4}
              transparent
            />
          </Sphere>
        </MouseFollowShape>
        
        <MouseFollowShape 
          mouseIntensity={0.12} 
          floatIntensity={1.5}
          positionIntensity={0.6}
          initialPosition={[-7, 6, -3]}
        >
          <Box args={[1.5, 1.5, 1.5]} rotation={[0.2, 0.3, 0.1]}>
            <meshStandardMaterial 
              color="#A8E6CF" 
              emissive="#A8E6CF"
              emissiveIntensity={0.1}
              roughness={0.5} 
              metalness={0.4}
              opacity={0.5}
              transparent
            />
          </Box>
        </MouseFollowShape>
        </Canvas>
      </div>
      
      {/* Foreground shapes - on top of content but below navigation */}
      <div className="fixed inset-0 z-[15] pointer-events-none">
        <Canvas camera={{ position: [0, 0, 20], fov: 50 }} style={{ pointerEvents: 'none' }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.3} />
          
          {/* Top left corner shape */}
          <MouseFollowShape 
            mouseIntensity={0.35} 
            floatIntensity={3.5}
            positionIntensity={3}
            initialPosition={[-6, 5, 5]}
          >
            <Octahedron args={[1, 0]}>
              <meshStandardMaterial 
                color="#FF6B9D" 
                emissive="#FF6B9D"
                emissiveIntensity={0.25}
                roughness={0.2} 
                metalness={0.9}
                opacity={0.25}
                transparent
              />
            </Octahedron>
          </MouseFollowShape>
          
          {/* Top right shape */}
          <MouseFollowShape 
            mouseIntensity={0.28} 
            floatIntensity={2.8}
            positionIntensity={2.2}
            initialPosition={[7, 4, 4]}
          >
            <Sphere args={[0.9, 24, 24]}>
              <meshStandardMaterial 
                color="#C06C84" 
                emissive="#C06C84"
                emissiveIntensity={0.2}
                roughness={0.3} 
                metalness={0.8}
                opacity={0.2}
                transparent
              />
            </Sphere>
          </MouseFollowShape>
          
          {/* Bottom left floating shape */}
          <MouseFollowShape 
            mouseIntensity={0.4} 
            floatIntensity={4.5}
            positionIntensity={3.5}
            initialPosition={[-5.5, -4, 3]}
          >
            <Torus args={[0.8, 0.3, 12, 24]} rotation={[0.5, 0.3, 0]}>
              <meshStandardMaterial 
                color="#66D9EF" 
                emissive="#66D9EF"
                emissiveIntensity={0.3}
                roughness={0.2} 
                metalness={0.85}
                opacity={0.22}
                transparent
              />
            </Torus>
          </MouseFollowShape>
          
          {/* Mid-right edge shape */}
          <MouseFollowShape 
            mouseIntensity={0.22} 
            floatIntensity={2}
            positionIntensity={1.8}
            initialPosition={[8.5, 0, 6]}
          >
            <Cone args={[0.7, 1.5, 5]} rotation={[0, 0, -0.4]}>
              <meshStandardMaterial 
                color="#F6C667" 
                emissive="#F6C667"
                emissiveIntensity={0.15}
                roughness={0.4} 
                metalness={0.6}
                opacity={0.18}
                transparent
              />
            </Cone>
          </MouseFollowShape>
        </Canvas>
      </div>
    </>
  );
};

export default LegalBackground;
