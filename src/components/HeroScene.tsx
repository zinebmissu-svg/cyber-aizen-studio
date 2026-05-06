import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment, Stars } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function ChromeBlob() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const { x, y } = state.pointer;
    ref.current.rotation.y += (x * 0.6 - ref.current.rotation.y) * 0.04;
    ref.current.rotation.x += (-y * 0.5 - ref.current.rotation.x) * 0.04;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.4, 6]} />
        <MeshDistortMaterial
          color="#a78bfa"
          metalness={1}
          roughness={0.1}
          distort={0.45}
          speed={1.6}
          envMapIntensity={1.4}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const count = 600;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.04;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#c4b5fd" transparent opacity={0.85} sizeAttenuation />
    </points>
  );
}

export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 4.2], fov: 55 }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#05060a"]} />
        <fog attach="fog" args={["#05060a", 5, 14]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#a78bfa" />
        <directionalLight position={[-5, -3, -2]} intensity={0.6} color="#7c3aed" />
        <ChromeBlob />
        <ParticleField />
        <Stars radius={50} depth={30} count={1200} factor={2} fade speed={0.4} />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
