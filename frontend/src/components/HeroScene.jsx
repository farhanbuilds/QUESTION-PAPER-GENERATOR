import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';

function Brain() {
  return (
    <Float
      speed={1.4}
      rotationIntensity={1}
      floatIntensity={2}
      floatingRange={[0, 0.5]}
    >
      <mesh>
        <torusKnotGeometry args={[2, 0.4, 128, 32]} />
        <meshNormalMaterial />
      </mesh>
    </Float>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 h-screen pointer-events-none mt-20">
      <div className="relative w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          className="!pointer-events-auto"
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Brain />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            rotateSpeed={0.5}
          />
        </Canvas>
      </div>
    </div>
  );
}