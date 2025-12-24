
import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Float, Text } from '@react-three/drei';
import { Experience } from './components/Experience';
import { TreeMorphState } from './types';
import { COLORS } from './constants';
import { Sparkles, Trees, Stars as StarIcon, Info, Share2, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [morphState, setMorphState] = useState<TreeMorphState>(TreeMorphState.SCATTERED);
  const [showOverlay, setShowOverlay] = useState(true);

  const toggleState = () => {
    setMorphState(prev => 
      prev === TreeMorphState.SCATTERED ? TreeMorphState.TREE_SHAPE : TreeMorphState.SCATTERED
    );
  };

  return (
    <div className="relative w-full h-screen bg-[#021a11] text-[#D4AF37]">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
          <color attach="background" args={[COLORS.DARK_EMERALD]} />
          <PerspectiveCamera makeDefault position={[0, 5, 25]} fov={45} />
          
          <Suspense fallback={null}>
            <Experience morphState={morphState} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          </Suspense>

          <OrbitControls 
            enablePan={false} 
            maxDistance={40} 
            minDistance={5} 
            autoRotate={morphState === TreeMorphState.TREE_SHAPE}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-8">
        {/* Header */}
        <header className="flex justify-between items-start pointer-events-auto">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-2 drop-shadow-lg">
              Merry <span className="text-[#FFD700]">Christmas</span>
            </h1>
          </div>
          <div className="flex gap-4">
             <button className="p-3 bg-emerald-950/40 border border-[#D4AF37]/30 rounded-full hover:bg-emerald-900 transition-colors">
               <Share2 size={20} />
             </button>
             <button className="p-3 bg-emerald-950/40 border border-[#D4AF37]/30 rounded-full hover:bg-emerald-900 transition-colors">
               <Info size={20} />
             </button>
          </div>
        </header>

        {/* State Toggle & Bottom UI */}
        <footer className="flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto">
          <div className="flex items-center gap-3 bg-emerald-950/60 backdrop-blur-md p-2 rounded-xl border border-[#D4AF37]/30 shadow-2xl">
            <div className={`p-2 rounded-lg transition-all duration-700 ${morphState === TreeMorphState.TREE_SHAPE ? 'bg-[#D4AF37] text-emerald-950' : 'bg-transparent text-[#D4AF37]'}`}>
              <Trees size={24} />
            </div>
            <div className="pr-1">
              <h3 className="text-sm font-bold tracking-wide">Spatial Config</h3>
            </div>
            <button 
              onClick={toggleState}
              className="ml-2 px-6 py-2.5 bg-[#D4AF37] text-emerald-950 text-xs font-bold rounded-full hover:bg-[#FFD700] transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.3)] uppercase tracking-wider"
            >
              {morphState === TreeMorphState.SCATTERED ? 'Manifest' : 'Dissolve'}
            </button>
          </div>

          <div className="max-w-xs text-right hidden lg:block">
            <p className="text-[10px] leading-relaxed opacity-50 uppercase tracking-widest italic">
              "lo vivo aspettando ogni nostro incontro"
            </p>
          </div>
        </footer>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[#D4AF37]/20 m-4 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[#D4AF37]/20 m-4 pointer-events-none"></div>
    </div>
  );
};

export default App;
