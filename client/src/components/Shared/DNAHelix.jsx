import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// DNA Strand — two spiraling helices with connecting rungs
function DNAStrand({ speed = 0.15 }) {
  const groupRef = useRef();
  const numPairs = 30;
  const radius = 1.2;
  const height = 12;
  const turns = 3;

  // Pre-compute sphere positions for both strands + rungs
  const { strand1, strand2, rungs } = useMemo(() => {
    const s1 = [];
    const s2 = [];
    const r = [];
    for (let i = 0; i < numPairs; i++) {
      const t = i / numPairs;
      const angle = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * height;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      s1.push([x1, y, z1]);
      s2.push([x2, y, z2]);
      r.push({ from: [x1, y, z1], to: [x2, y, z2] });
    }
    return { strand1: s1, strand2: s2, rungs: r };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * speed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Strand 1 — Cyan spheres */}
      {strand1.map((pos, i) => (
        <mesh key={`s1-${i}`} position={pos}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Strand 2 — Violet spheres */}
      {strand2.map((pos, i) => (
        <mesh key={`s2-${i}`} position={pos}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Connecting rungs */}
      {rungs.map((rung, i) => {
        const from = new THREE.Vector3(...rung.from);
        const to = new THREE.Vector3(...rung.to);
        const mid = from.clone().lerp(to, 0.5);
        const len = from.distanceTo(to);
        const dir = to.clone().sub(from).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir
        );

        // Alternate rung colors
        const isEven = i % 2 === 0;
        return (
          <mesh key={`r-${i}`} position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.02, 0.02, len, 8]} />
            <meshStandardMaterial
              color={isEven ? "#a5b4fc" : "#67e8f9"}
              emissive={isEven ? "#a5b4fc" : "#67e8f9"}
              emissiveIntensity={1.5}
              transparent
              opacity={0.5}
              toneMapped={false}
            />
          </mesh>
        );
      })}

      {/* Core glow */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#6366f1" distance={10} />
      <pointLight position={[0, 3, 2]} intensity={1} color="#06b6d4" distance={8} />
      <pointLight position={[0, -3, -2]} intensity={1} color="#8b5cf6" distance={8} />
    </group>
  );
}

// Full canvas scene with stars and DNA helix
export default function DNAHelix({ className, style }) {
  return (
    <div className={className} style={{ width: "100%", height: "100%", ...style }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <Stars
          radius={60}
          depth={50}
          count={1500}
          factor={3}
          saturation={0}
          fade
          speed={0.4}
        />
        <ambientLight intensity={0.15} />
        <DNAStrand />
      </Canvas>
    </div>
  );
}
