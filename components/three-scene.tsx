"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Points, PointMaterial } from "@react-three/drei";
import type { Group, PointLight } from "three";

interface ThreeSceneProps {
  scrollProgress: number;
  activeStepIndex: number;
  totalSteps: number;
}

interface CameraPreset {
  x: number;
  y: number;
  z: number;
  lookAtY: number;
  leftIntensity: number;
  rightIntensity: number;
}

const CAMERA_KEYFRAMES: CameraPreset[] = [
  // 01 Planning: wide and high overview
  { x: -0.35, y: 0.22, z: 7.35, lookAtY: 0.06, leftIntensity: 1.15, rightIntensity: 0.82 },
  // 02 Architecture: slightly angled perspective
  { x: -0.1, y: 0.1, z: 6.95, lookAtY: 0.02, leftIntensity: 1.32, rightIntensity: 0.94 },
  // 03 Development: forward movement and stronger contrast
  { x: 0.2, y: 0.03, z: 6.55, lookAtY: 0, leftIntensity: 1.52, rightIntensity: 1.08 },
  // 04 QA: focused close-up
  { x: 0.1, y: -0.06, z: 6.25, lookAtY: -0.03, leftIntensity: 1.7, rightIntensity: 1.2 },
  // 05 Deployment: energetic diagonal
  { x: -0.24, y: -0.02, z: 6.42, lookAtY: 0, leftIntensity: 1.6, rightIntensity: 1.35 },
  // 06 Operation: calmer and stabilized
  { x: 0, y: 0.06, z: 6.7, lookAtY: 0.04, leftIntensity: 1.3, rightIntensity: 1.1 },
];

function NeuralCluster({ scrollProgress, activeStepIndex, totalSteps }: ThreeSceneProps) {
  const groupRef = useRef<Group>(null);
  const points = useMemo(() => {
    const arr = new Float32Array(1200 * 3);

    const pseudoNoise = (seed: number, freq: number) =>
      Math.sin(seed * freq) * Math.cos(seed * (freq * 0.37));

    for (let i = 0; i < arr.length; i += 3) {
      const seed = i / 3 + 1;
      arr[i] = pseudoNoise(seed, 1.7) * 6;
      arr[i + 1] = pseudoNoise(seed, 2.1) * 4;
      arr[i + 2] = pseudoNoise(seed, 2.7) * 4;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = state.clock.elapsedTime;
    const activeRatio = totalSteps <= 1 ? 0 : activeStepIndex / (totalSteps - 1);
    groupRef.current.rotation.y = elapsed * 0.08 + scrollProgress * 0.5 + activeRatio * 0.36;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.2) * 0.08;
    groupRef.current.position.y = Math.sin(elapsed * 0.25) * 0.18 + activeRatio * 0.14;
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.35}>
        <mesh position={[-2.2, 1.1, -1.4]}>
          <icosahedronGeometry args={[0.85, 1]} />
          <meshStandardMaterial color="#8b98ff" emissive="#4b54a7" metalness={0.3} roughness={0.1} />
        </mesh>
      </Float>

      <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.45}>
        <mesh position={[2.1, -0.8, -0.4]}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color="#7cf5cb" emissive="#2a6f5a" metalness={0.2} roughness={0.2} />
        </mesh>
      </Float>

      <Points positions={points} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#a8b2ff" size={0.03} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
}

interface SceneRigProps {
  scrollProgress: number;
  activeStepIndex: number;
  totalSteps: number;
}

function SceneRig({ scrollProgress, activeStepIndex, totalSteps }: SceneRigProps) {
  const leftLightRef = useRef<PointLight>(null);
  const rightLightRef = useRef<PointLight>(null);

  useFrame((state) => {
    const camera = state.camera;
    const maxPresetIndex = Math.max(0, Math.min(CAMERA_KEYFRAMES.length - 1, totalSteps - 1));
    const safeIndex = Math.max(0, Math.min(activeStepIndex, maxPresetIndex));
    const preset = CAMERA_KEYFRAMES[safeIndex] ?? CAMERA_KEYFRAMES[0];
    const scrollOffset = (scrollProgress - 0.5) * 0.18;
    const targetX = preset.x + Math.sin(scrollProgress * Math.PI * 2) * 0.04;
    const targetY = preset.y + scrollOffset;
    const targetZ = preset.z - scrollProgress * 0.18;

    camera.position.z += (targetZ - camera.position.z) * 0.06;
    camera.position.x += (targetX - camera.position.x) * 0.06;
    camera.position.y += (targetY - camera.position.y) * 0.06;
    camera.lookAt(0, preset.lookAtY, 0);

    if (leftLightRef.current && rightLightRef.current) {
      const leftTarget = preset.leftIntensity + scrollProgress * 0.12;
      const rightTarget = preset.rightIntensity + scrollProgress * 0.14;
      leftLightRef.current.intensity += (leftTarget - leftLightRef.current.intensity) * 0.08;
      rightLightRef.current.intensity += (rightTarget - rightLightRef.current.intensity) * 0.08;
    }
  });

  return (
    <>
      <pointLight
        ref={leftLightRef}
        position={[3, 4, 4]}
        intensity={1.35}
        color="#8895ff"
      />
      <pointLight
        ref={rightLightRef}
        position={[-2, -2, 2]}
        intensity={0.9}
        color="#79f5c7"
      />
    </>
  );
}

export function ThreeScene({ scrollProgress, activeStepIndex, totalSteps }: ThreeSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 6.8], fov: 50 }} dpr={[1, 1.6]}>
      <ambientLight intensity={0.3} />
      <SceneRig
        scrollProgress={scrollProgress}
        activeStepIndex={activeStepIndex}
        totalSteps={totalSteps}
      />
      <NeuralCluster
        scrollProgress={scrollProgress}
        activeStepIndex={activeStepIndex}
        totalSteps={totalSteps}
      />
    </Canvas>
  );
}
