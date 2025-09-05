import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { MouseFollowBadge, Badge } from './Badge3D';
import { useState, useEffect } from 'react';

const BadgeBackground = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show 3D floating badges only on screens wider than 1200px
  if (windowSize.width < 1200) {
    return null;
  }

  return (
    <>
      {/* Background badges only - behind content */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 20], fov: 50 }} style={{ pointerEvents: 'none' }}>
          <Environment preset="studio" />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.6} />
          
          {/* Left side badges - spread vertically */}
          <MouseFollowBadge 
            mouseIntensity={0.08} 
            floatIntensity={1.5}
            positionIntensity={0.8}
            initialPosition={[-15, 6, -2]}
          >
            <Badge scale={1.05} />
          </MouseFollowBadge>
          
          <MouseFollowBadge 
            mouseIntensity={0.06} 
            floatIntensity={1.2}
            positionIntensity={0.6}
            initialPosition={[-13, 0, -3]}
          >
            <Badge scale={0.9} />
          </MouseFollowBadge>
          
          <MouseFollowBadge 
            mouseIntensity={0.05} 
            floatIntensity={1.0}
            positionIntensity={0.5}
            initialPosition={[-16, -6, -4]}
          >
            <Badge scale={0.8} />
          </MouseFollowBadge>
          
          {/* Right side badges - spread vertically */}
          <MouseFollowBadge 
            mouseIntensity={0.1} 
            floatIntensity={1.8}
            positionIntensity={1.0}
            initialPosition={[15, 5, -1]}
          >
            <Badge scale={0.95} />
          </MouseFollowBadge>
          
          <MouseFollowBadge 
            mouseIntensity={0.07} 
            floatIntensity={1.0}
            positionIntensity={0.7}
            initialPosition={[13, -1, -4]}
          >
            <Badge scale={0.85} />
          </MouseFollowBadge>
          
          <MouseFollowBadge 
            mouseIntensity={0.04} 
            floatIntensity={0.8}
            positionIntensity={0.4}
            initialPosition={[16, -7, -5]}
          >
            <Badge scale={0.75} />
          </MouseFollowBadge>
        </Canvas>
      </div>
    </>
  );
};

export default BadgeBackground;
