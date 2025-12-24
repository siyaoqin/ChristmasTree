
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeMorphState, ParticleData, OrnamentData } from '../types';
import { COLORS, TREE_CONFIG } from '../constants';
import { Float } from '@react-three/drei';

interface ChristmasTreeProps {
  morphState: TreeMorphState;
}

interface ColoredOrnamentData extends OrnamentData {
  color: THREE.Color;
  rotation: [number, number, number];
  type: 'box' | 'sphere';
  boxScale: [number, number, number];
}

export const ChristmasTree: React.FC<ChristmasTreeProps> = ({ morphState }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const innerMeshRef = useRef<THREE.InstancedMesh>(null);
  const ornamentRef = useRef<THREE.InstancedMesh>(null);
  const lightsRef = useRef<THREE.InstancedMesh>(null);
  const candiesRef = useRef<THREE.InstancedMesh>(null);
  const bellsRef = useRef<THREE.InstancedMesh>(null);
  
  // Refs for geometric decorations
  const boxGeomRef = useRef<THREE.InstancedMesh>(null);
  const sphereGeomRef = useRef<THREE.InstancedMesh>(null);
  
  const progressRef = useRef(0);
  const targetProgress = morphState === TreeMorphState.TREE_SHAPE ? 1 : 0;

  const getSurfacePos = (hRatio: number, angle: number, offset: number = 1.01): [number, number, number] => {
    const height = (1 - hRatio) * TREE_CONFIG.HEIGHT - (TREE_CONFIG.HEIGHT / 2);
    const radius = hRatio * TREE_CONFIG.RADIUS * offset;
    return [Math.cos(angle) * radius, height, Math.sin(angle) * radius];
  };

  const needles = useMemo(() => {
    const data: ParticleData[] = [];
    for (let i = 0; i < TREE_CONFIG.PARTICLE_COUNT; i++) {
      const scatterPos: [number, number, number] = [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50];
      const ratio = i / TREE_CONFIG.PARTICLE_COUNT;
      const angle = ratio * Math.PI * 65 + Math.random();
      const treePos = getSurfacePos(ratio, angle, 1 - Math.pow(1 - ratio, 2));
      data.push({
        scatterPosition: scatterPos,
        treePosition: treePos,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.2 + Math.random() * 0.4,
        color: Math.random() > 0.96 ? COLORS.GOLD : COLORS.EMERALD
      });
    }
    return data;
  }, []);

  const innerNeedles = useMemo(() => {
    const data: ParticleData[] = [];
    for (let i = 0; i < TREE_CONFIG.INNER_NEEDLE_COUNT; i++) {
      const hRatio = Math.random();
      const rRatio = Math.sqrt(Math.random()) * 0.9; 
      const angle = Math.random() * Math.PI * 2;
      const treePos = getSurfacePos(hRatio, angle, rRatio);
      data.push({
        scatterPosition: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40],
        treePosition: treePos,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: 0.35 + Math.random() * 0.5,
        color: COLORS.DEEP_EMERALD
      });
    }
    return data;
  }, []);

  const geometricDecorations = useMemo(() => {
    const boxes: ColoredOrnamentData[] = [];
    const spheres: ColoredOrnamentData[] = [];
    // Enhanced palette with vibrant jewel tones for a high-end festive look
    const harmoniousColors = [
      COLORS.GOLD, 
      COLORS.BRIGHT_GOLD, 
      COLORS.EMERALD, 
      COLORS.SILVER, 
      COLORS.WHITE_GLOW,
      COLORS.RUBY,
      COLORS.SAPPHIRE,
      COLORS.AMBER,
      COLORS.AMETHYST,
      '#e91e63', // Rose Gold feel
      '#00bcd4'  // Frozen Cyan feel
    ];
    
    for (let i = 0; i < TREE_CONFIG.GEOMETRIC_COUNT; i++) {
      const ratio = 0.1 + Math.random() * 0.85;
      const angle = Math.random() * Math.PI * 2;
      const type = Math.random() > 0.4 ? 'box' : 'sphere';
      const color = new THREE.Color(harmoniousColors[Math.floor(Math.random() * harmoniousColors.length)]);
      
      const item: ColoredOrnamentData = {
        scatterPosition: [(Math.random() - 0.5) * 45, (Math.random() - 0.5) * 45, (Math.random() - 0.5) * 45],
        treePosition: getSurfacePos(ratio, angle, 1.05),
        // Increased base scale for better visibility as requested
        scale: 0.35 + Math.random() * 0.45,
        color,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        type,
        boxScale: Math.random() > 0.5 ? [1, 1, 1] : [1, 1.4 + Math.random() * 1.2, 1] 
      };

      if (type === 'box') boxes.push(item);
      else spheres.push(item);
    }
    return { boxes, spheres };
  }, []);

  const candies = useMemo(() => {
    const data: ColoredOrnamentData[] = [];
    for (let i = 0; i < TREE_CONFIG.CANDY_COUNT; i++) {
      const ratio = 0.15 + Math.random() * 0.75;
      const angle = Math.random() * Math.PI * 2;
      data.push({ 
        scatterPosition: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40], 
        treePosition: getSurfacePos(ratio, angle, 1.02), 
        scale: 0.3 + Math.random() * 0.2,
        color: new THREE.Color(Math.random() > 0.5 ? COLORS.CANDY_RED : COLORS.WHITE_GLOW),
        rotation: [Math.random(), Math.random(), Math.random()],
        type: 'box',
        boxScale: [1, 1, 1]
      });
    }
    return data;
  }, []);

  const bells = useMemo(() => {
    const data: ColoredOrnamentData[] = [];
    for (let i = 0; i < TREE_CONFIG.BELL_COUNT; i++) {
      const ratio = 0.2 + Math.random() * 0.7;
      const angle = Math.random() * Math.PI * 2;
      data.push({ 
        scatterPosition: [(Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35, (Math.random() - 0.5) * 35], 
        treePosition: getSurfacePos(ratio, angle, 1.03), 
        scale: 0.4 + Math.random() * 0.3,
        color: new THREE.Color(Math.random() > 0.5 ? COLORS.GOLD : COLORS.BRIGHT_GOLD),
        rotation: [0, 0, 0],
        type: 'sphere',
        boxScale: [1, 1, 1]
      });
    }
    return data;
  }, []);

  const ornaments = useMemo(() => {
    const data: ColoredOrnamentData[] = [];
    for (let i = 0; i < TREE_CONFIG.ORNAMENT_COUNT; i++) {
      const ratio = 0.1 + Math.random() * 0.85;
      const angle = Math.random() * Math.PI * 2;
      data.push({ 
        scatterPosition: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40], 
        treePosition: getSurfacePos(ratio, angle, 1.01), 
        scale: 0.2 + Math.random() * 0.4,
        color: new THREE.Color(Math.random() > 0.8 ? COLORS.SILVER : COLORS.GOLD),
        rotation: [0, 0, 0],
        type: 'sphere',
        boxScale: [1, 1, 1]
      });
    }
    return data;
  }, []);

  const stringLights = useMemo(() => {
    const data: OrnamentData[] = [];
    for (let i = 0; i < TREE_CONFIG.LIGHT_COUNT; i++) {
      const ratio = i / TREE_CONFIG.LIGHT_COUNT;
      const spiralAngle = ratio * Math.PI * 34;
      data.push({ 
        scatterPosition: [(Math.random() - 0.5) * 45, (Math.random() - 0.5) * 45, (Math.random() - 0.5) * 45], 
        treePosition: getSurfacePos(ratio, spiralAngle, 1.05), 
        scale: 0.14 + Math.random() * 0.1 
      });
    }
    return data;
  }, []);

  useEffect(() => {
    if (candiesRef.current) candies.forEach((c, i) => candiesRef.current!.setColorAt(i, c.color));
    if (bellsRef.current) bells.forEach((b, i) => bellsRef.current!.setColorAt(i, b.color));
    if (ornamentRef.current) ornaments.forEach((o, i) => ornamentRef.current!.setColorAt(i, o.color));
    if (innerMeshRef.current) innerNeedles.forEach((n, i) => innerMeshRef.current!.setColorAt(i, new THREE.Color(n.color)));
    
    // Set colors for geometric decorations
    if (boxGeomRef.current) geometricDecorations.boxes.forEach((b, i) => boxGeomRef.current!.setColorAt(i, b.color));
    if (sphereGeomRef.current) geometricDecorations.spheres.forEach((s, i) => sphereGeomRef.current!.setColorAt(i, s.color));
  }, [candies, bells, ornaments, innerNeedles, geometricDecorations]);

  const dummy = new THREE.Object3D();

  useFrame((state) => {
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, targetProgress, 0.04);
    const p = progressRef.current;
    const time = state.clock.elapsedTime;

    const updateLayer = (ref: React.RefObject<THREE.InstancedMesh>, items: any[], callback?: (i: number, item: any) => void) => {
      if (!ref.current) return;
      items.forEach((item, i) => {
        const x = THREE.MathUtils.lerp(item.scatterPosition[0], item.treePosition[0], p);
        const y = THREE.MathUtils.lerp(item.scatterPosition[1], item.treePosition[1], p);
        const z = THREE.MathUtils.lerp(item.scatterPosition[2], item.treePosition[2], p);
        dummy.position.set(x, y, z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(item.scale * p);
        if (callback) callback(i, item);
        dummy.updateMatrix();
        ref.current!.setMatrixAt(i, dummy.matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    };

    if (meshRef.current) {
      needles.forEach((n, i) => {
        const x = THREE.MathUtils.lerp(n.scatterPosition[0], n.treePosition[0], p);
        const y = THREE.MathUtils.lerp(n.scatterPosition[1], n.treePosition[1], p);
        const z = THREE.MathUtils.lerp(n.scatterPosition[2], n.treePosition[2], p);
        dummy.position.set(x, y + (1 - p) * Math.sin(time + i) * 0.3, z);
        dummy.rotation.set(n.rotation[0], n.rotation[1] + (p * time * 0.3), n.rotation[2]);
        dummy.scale.setScalar(n.scale * (0.2 + p * 0.8));
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }

    updateLayer(innerMeshRef, innerNeedles, (i, n) => dummy.rotation.set(n.rotation[0], n.rotation[1], n.rotation[2]));
    updateLayer(ornamentRef, ornaments, (i) => { dummy.position.y += (1 - p) * Math.cos(time + i) * 0.5; dummy.rotation.y = time * 0.4; });
    updateLayer(lightsRef, stringLights, (i) => { const tw = Math.sin(time * 5 + i) * 0.5 + 0.5; dummy.scale.multiplyScalar(0.7 + tw * 0.5); });
    updateLayer(candiesRef, candies, (i, c) => { dummy.rotation.set(c.rotation[0], c.rotation[1] + time * 0.5, c.rotation[2]); });
    updateLayer(bellsRef, bells, (i) => { dummy.rotation.z = Math.sin(time * 2 + i) * 0.3 * p; });

    // Update Geometric Ornaments
    updateLayer(boxGeomRef, geometricDecorations.boxes, (i, b) => {
      dummy.rotation.set(b.rotation[0] + time * 0.2, b.rotation[1] + time * 0.3, b.rotation[2]);
      dummy.scale.set(b.scale * p * b.boxScale[0], b.scale * p * b.boxScale[1], b.scale * p * b.boxScale[2]);
    });
    updateLayer(sphereGeomRef, geometricDecorations.spheres, (i) => {
      dummy.position.y += Math.sin(time + i) * 0.05 * p;
    });
  });

  return (
    <group>
      {/* Crown Star - Further reduced scale and floating for extreme delicacy */}
      <Float speed={1.0} rotationIntensity={0.15} floatIntensity={0.015}>
        <mesh position={[0, TREE_CONFIG.HEIGHT / 2 + 1.1, 0]} scale={targetProgress * 0.55}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color={COLORS.BRIGHT_GOLD} emissive={COLORS.BRIGHT_GOLD} emissiveIntensity={20} metalness={1} roughness={0} />
          <pointLight color={COLORS.BRIGHT_GOLD} intensity={14} distance={15} />
        </mesh>
      </Float>

      {/* Prominent Colorful Geometric Decorations */}
      <instancedMesh ref={boxGeomRef} args={[undefined, undefined, geometricDecorations.boxes.length]} castShadow>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial metalness={0.9} roughness={0.1} />
      </instancedMesh>
      <instancedMesh ref={sphereGeomRef} args={[undefined, undefined, geometricDecorations.spheres.length]} castShadow>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial metalness={1.0} roughness={0.05} />
      </instancedMesh>

      <instancedMesh ref={meshRef} args={[undefined, undefined, TREE_CONFIG.PARTICLE_COUNT]} castShadow>
        <boxGeometry args={[0.4, 0.04, 0.04]} />
        <meshStandardMaterial metalness={0.9} roughness={0.1} color={COLORS.EMERALD} emissive={COLORS.EMERALD} emissiveIntensity={0.6} />
      </instancedMesh>

      <instancedMesh ref={innerMeshRef} args={[undefined, undefined, TREE_CONFIG.INNER_NEEDLE_COUNT]} castShadow>
        <boxGeometry args={[0.55, 0.05, 0.05]} />
        <meshStandardMaterial metalness={0.2} roughness={0.9} emissive={COLORS.DEEP_EMERALD} emissiveIntensity={0.5} />
      </instancedMesh>

      <instancedMesh ref={candiesRef} args={[undefined, undefined, TREE_CONFIG.CANDY_COUNT]} castShadow>
        <capsuleGeometry args={[0.1, 0.45, 4, 8]} />
        <meshStandardMaterial metalness={0.4} roughness={0.1} emissiveIntensity={0.2} />
      </instancedMesh>

      <instancedMesh ref={bellsRef} args={[undefined, undefined, TREE_CONFIG.BELL_COUNT]} castShadow>
        <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial metalness={1} roughness={0.1} />
      </instancedMesh>

      <instancedMesh ref={ornamentRef} args={[undefined, undefined, TREE_CONFIG.ORNAMENT_COUNT]} castShadow>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial metalness={1} roughness={0.05} />
      </instancedMesh>

      <instancedMesh ref={lightsRef} args={[undefined, undefined, TREE_CONFIG.LIGHT_COUNT]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={COLORS.LIGHT_GLOW} emissive={COLORS.BRIGHT_GOLD} emissiveIntensity={14} transparent opacity={0.95} />
      </instancedMesh>

      <mesh position={[0, 0, 0]} scale={[1, TREE_CONFIG.HEIGHT, 1]}>
        <cylinderGeometry args={[0.2, 0.6, 1, 16]} />
        <meshStandardMaterial color={COLORS.DARK_EMERALD} transparent opacity={0.8 * targetProgress} metalness={1} emissive={COLORS.DARK_EMERALD} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
};
