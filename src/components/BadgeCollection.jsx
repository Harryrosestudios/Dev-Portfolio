import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import Badge3D from './Badge3D';
import Loading from './Loading';

const BadgeCollection = () => {
  // For now, we'll create multiple instances of the same badge
  // You can add different badges here as you earn them
  const badges = [
    { 
      id: 1, 
      position: [-3, 0, 0], 
      textureUrl: 'textures/aws-cloud-computing-101.svg',
      name: 'AWS Cloud Computing 101'
    },
    { 
      id: 2, 
      position: [0, 0, 0], 
      textureUrl: 'textures/aws-cloud-computing-101.svg',
      name: 'AWS Cloud Computing 101 (Duplicate)'
    },
    { 
      id: 3, 
      position: [3, 0, 0], 
      textureUrl: 'textures/aws-cloud-computing-101.svg',
      name: 'AWS Cloud Computing 101 (Duplicate)'
    }
  ];

  return (
    <div className="w-full h-96 relative">
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Environment for reflections */}
          <Environment preset="studio" />
          
          {/* Ambient lighting */}
          <ambientLight intensity={0.4} color="#ffffff" />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Render badges */}
          {badges.map((badge) => (
            <Badge3D
              key={badge.id}
              position={badge.position}
              textureUrl={badge.textureUrl}
              scale={0.8}
            />
          ))}

          {/* Optional: Add orbit controls for debugging (remove in production) */}
          {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
        </Suspense>
      </Canvas>

      {/* Badge labels */}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Professional Certifications</h3>
        <p className="text-white-600 text-sm">Interactive 3D badges - hover to explore</p>
      </div>
    </div>
  );
};

export default BadgeCollection;
