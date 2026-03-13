import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Hook to detect theme
function useTheme() {
  const [theme, setTheme] = useState("dark");
  
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(currentTheme);
    };
    
    updateTheme();
    
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    
    return () => observer.disconnect();
  }, []);
  
  return theme;
}

// Floating health metric particles
function HealthParticles({ count = 50, isDark = true }) {
  const particles = useRef();
  
  const particleData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const colorPalette = isDark ? [
      new THREE.Color("#00f5d4"), // Teal
      new THREE.Color("#00bbf9"), // Blue
      new THREE.Color("#9b5de5"), // Purple
      new THREE.Color("#f15bb5"), // Pink
      new THREE.Color("#fee440"), // Yellow
    ] : [
      new THREE.Color("#00b4a0"), // Teal (muted)
      new THREE.Color("#0891b2"), // Blue (muted)
      new THREE.Color("#7c3aed"), // Purple (muted)
      new THREE.Color("#db2777"), // Pink (muted)
      new THREE.Color("#ca8a04"), // Yellow (muted)
    ];
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 1.5;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = 0.03 + Math.random() * 0.05;
    }
    
    return { positions, colors, sizes };
  }, [count, isDark]);
  
  useFrame((state) => {
    if (particles.current) {
      particles.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      particles.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });
  
  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleData.positions.length / 3}
          array={particleData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleData.colors.length / 3}
          array={particleData.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Orbiting rings representing health metrics
function OrbitRing({ radius, color, speed, tilt }) {
  const ringRef = useRef();
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.getElapsedTime() * speed;
    }
  });
  
  return (
    <group rotation={[tilt, 0, 0]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[radius, 0.015, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// Central pulsing health orb
function CentralOrb({ isDark = true }) {
  const meshRef = useRef();
  const glowRef = useRef();
  
  const primaryColor = isDark ? "#00f5d4" : "#00b4a0";
  const secondaryColor = isDark ? "#00bbf9" : "#0891b2";
  const accentColor = isDark ? "#f15bb5" : "#db2777";
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.2 + Math.sin(t * 1.5) * 0.1);
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group>
        {/* Inner core */}
        <Sphere ref={meshRef} args={[1, 64, 64]}>
          <MeshDistortMaterial
            color={primaryColor}
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            emissive={primaryColor}
            emissiveIntensity={isDark ? 0.5 : 0.3}
          />
        </Sphere>
        
        {/* Outer glow layer */}
        <Sphere ref={glowRef} args={[1.15, 32, 32]}>
          <meshStandardMaterial
            color={secondaryColor}
            transparent
            opacity={isDark ? 0.15 : 0.1}
            side={THREE.BackSide}
          />
        </Sphere>
        
        {/* Heartbeat pulse rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.35, 64]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={isDark ? 2 : 1.2}
            transparent
            opacity={0.4}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Floating health icons (simplified geometric shapes)
function HealthIcon({ position, shape, color }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + position[0]) * 0.2;
    }
  });
  
  const geometry = useMemo(() => {
    switch (shape) {
      case "heart":
        return <icosahedronGeometry args={[0.15, 0]} />;
      case "pulse":
        return <octahedronGeometry args={[0.12, 0]} />;
      case "shield":
        return <dodecahedronGeometry args={[0.13, 0]} />;
      default:
        return <tetrahedronGeometry args={[0.12, 0]} />;
    }
  }, [shape]);
  
  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3}
        metalness={0.5}
        roughness={0.2}
        toneMapped={false}
      />
    </mesh>
  );
}

// Main 3D Scene
function Scene({ isDark = true }) {
  const colors = isDark ? {
    primary: "#00f5d4",
    secondary: "#00bbf9",
    accent: "#9b5de5",
    pink: "#f15bb5",
    yellow: "#fee440",
  } : {
    primary: "#00b4a0",
    secondary: "#0891b2",
    accent: "#7c3aed",
    pink: "#db2777",
    yellow: "#ca8a04",
  };
  
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={isDark ? 0.2 : 0.4} />
      <directionalLight position={[5, 5, 5]} intensity={isDark ? 0.5 : 0.7} />
      
      {/* Central health orb */}
      <CentralOrb isDark={isDark} />
      
      {/* Orbital rings */}
      <OrbitRing radius={1.8} color={colors.primary} speed={0.3} tilt={Math.PI / 6} />
      <OrbitRing radius={2.2} color={colors.accent} speed={-0.2} tilt={-Math.PI / 4} />
      <OrbitRing radius={2.6} color={colors.secondary} speed={0.15} tilt={Math.PI / 3} />
      
      {/* Floating particles */}
      <HealthParticles count={80} isDark={isDark} />
      
      {/* Health icons */}
      <HealthIcon position={[2, 1, 0]} shape="heart" color={colors.pink} />
      <HealthIcon position={[-2, -0.5, 1]} shape="pulse" color={colors.primary} />
      <HealthIcon position={[1, -1.5, -1.5]} shape="shield" color={colors.yellow} />
      <HealthIcon position={[-1.5, 1.2, -1]} shape="dna" color={colors.accent} />
      
      {/* Point lights for ambient glow */}
      <pointLight position={[3, 3, 3]} intensity={isDark ? 1 : 0.6} color={colors.primary} distance={10} />
      <pointLight position={[-3, -3, 3]} intensity={isDark ? 1 : 0.6} color={colors.accent} distance={10} />
      <pointLight position={[0, 0, 5]} intensity={isDark ? 0.5 : 0.3} color={colors.secondary} distance={8} />
    </>
  );
}

export default function HealthOrb({ className, style }) {
  const theme = useTheme();
  const isDark = theme === "dark";
  
  return (
    <div className={className} style={{ width: "100%", height: "100%", ...style }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene isDark={isDark} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
