import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function NigeriaModel() {
  const groupRef = useRef();
  const [isInteracting, setIsInteracting] = useState(false);
  const autoRotationRef = useRef(0);
  
  // Load materials and object
  const materials = useLoader(MTLLoader, '/71-nigeria_3d_map/3d Nigeria.mtl');
  const object = useLoader(OBJLoader, '/71-nigeria_3d_map/3d Nigeria.obj', (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

//   // Enhanced materials with sharp, dark look
//   useEffect(() => {
//     if (object) {
//       object.traverse((child) => {
//         if (child.isMesh) {
//           child.material.metalness = 0.8;
//           child.material.roughness = 0.2;
//           child.material.envMapIntensity = 1.5;
//           child.castShadow = true;
//           child.receiveShadow = true;
//         }
//       });
//     }
//   }, [object]);

  // Smooth auto-rotation that resumes after user interaction
//   useFrame((state, delta) => {
//     if (groupRef.current) {
//       if (!isInteracting) {
//         // Smooth auto-rotation
//         autoRotationRef.current += delta * 0.3;
//         groupRef.current.rotation.y = THREE.MathUtils.lerp(
//           groupRef.current.rotation.y,
//           autoRotationRef.current,
//           0.1
//         );
//       } else {
//         // Update the auto-rotation reference to current position when user interacts
//         autoRotationRef.current = groupRef.current.rotation.y;
//       }
      
//       // Subtle floating animation
//       groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
//     }
//   });

// In NigeriaModel component
const logRotation = useRef(true); // Toggle logging on/off

useEffect(() => {
  if (groupRef.current && logRotation.current) {
    const interval = setInterval(() => {
      const { x, y, z } = groupRef.current.rotation;
      console.log('Current rotation (radians):', { x, y, z });
      console.log('Current rotation (degrees):', {
        x: THREE.MathUtils.radToDeg(x).toFixed(2) + '°',
        y: THREE.MathUtils.radToDeg(y).toFixed(2) + '°',
        z: THREE.MathUtils.radToDeg(z).toFixed(2) + '°'
      });
    }, 1000); // Log every second
    
    return () => clearInterval(interval);
  }
}, []);

  return (
    <group 
      ref={groupRef} 
      scale={0.38}
      rotation={[0.157,1.57,0,]}
      position={[0, 0, 0]}
    >
      <primitive object={object} />
    </group>
  );
}

export default function Nigeria3DModel() {
  const [isInteracting, setIsInteracting] = useState(false);
  const controlsRef = useRef();

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-2xl 00bg-gradient-to-br from-[#0C3B2E] to-[#1a1a1a]">
      <Canvas
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}

      >
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={45} />
        
        {/* Strong Dark Lighting Setup */}
        <ambientLight intensity={0.3} color="#ffffff" />
        
        {/* Key light - strong from top-right */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          color="#ffffff"
        />
        
        {/* Rim light - creates sharp edge definition */}
        <directionalLight
          position={[-5, 3, -5]}
          intensity={1.5}
          color="#22C55E"
        />
        
        {/* Fill light - subtle green accent */}
        <pointLight position={[0, -5, 5]} intensity={0.8} color="#FACC15" />
        
        {/* Spot light for dramatic effect */}
        <spotLight
          position={[0, 10, 0]}
          angle={0.6}
          penumbra={0.5}
          intensity={1}
          castShadow
          color="#ffffff"
        />

        <fog attach="fog" args={['#0C3B2E', 5, 20]} />

        <NigeriaModel />
        
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={12}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          onStart={() => setIsInteracting(true)}
          onEnd={() => {
            setTimeout(() => setIsInteracting(false), 2000); // Resume auto-rotation after 2s
          }}
        />
        
        {/* Environment reflection */}
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
      </Canvas>
    </div>
  );
}
