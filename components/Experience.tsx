
import React from 'react';
import { Bloom, EffectComposer, Noise, Vignette, BrightnessContrast } from '@react-three/postprocessing';
import { TreeMorphState } from '../types';
import { ChristmasTree } from './ChristmasTree';
import { COLORS } from '../constants';

interface ExperienceProps {
  morphState: TreeMorphState;
}

export const Experience: React.FC<ExperienceProps> = ({ morphState }) => {
  return (
    <>
      {/* High-Fidelity Lighting Suite */}
      <ambientLight intensity={1.5} color={COLORS.EMERALD} />
      <pointLight position={[15, 15, 15]} intensity={4} color={COLORS.BRIGHT_GOLD} />
      <pointLight position={[-15, 10, -15]} intensity={3} color={COLORS.EMERALD} />
      <pointLight position={[0, 0, 10]} intensity={2} color={COLORS.GOLD} />
      
      <spotLight 
        position={[0, 30, 0]} 
        angle={0.4} 
        penumbra={1} 
        intensity={8} 
        castShadow 
        color={COLORS.WHITE_GLOW} 
      />

      {/* Core Masterpiece */}
      <ChristmasTree morphState={morphState} />

      {/* Ground Reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          color={COLORS.DARK_EMERALD} 
          roughness={0.02} 
          metalness={1.0} 
          opacity={0.8} 
          transparent
        />
      </mesh>

      {/* Post-processing for Cinematic Brilliance */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.3} 
          mipmapBlur 
          intensity={2.5} 
          radius={0.6} 
        />
        <BrightnessContrast brightness={0.08} contrast={0.15} />
        <Noise opacity={0.04} />
        <Vignette eskil={false} offset={0.1} darkness={1.0} />
      </EffectComposer>
    </>
  );
};
