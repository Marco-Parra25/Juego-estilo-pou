import React, { useMemo } from 'react';
import { Mood, Stats } from '../types';
import { COLORS } from '../constants';

interface CharacterProps {
  mood: Mood;
  stats: Stats;
  mousePos: { x: number; y: number };
  onClick: () => void;
  isSleeping: boolean;
  scale: number;
  showVeins: boolean;
}

export const Character: React.FC<CharacterProps> = ({ mood, stats, mousePos, onClick, isSleeping, scale, showVeins }) => {
  
  // Calculate Eye Tracking
  const calculateEyeOffset = (eyeX: number, eyeY: number) => {
    if (isSleeping) return { x: 0, y: 0 };
    
    // Simple logic to limit eye movement within the sclera
    const limit = 6; 
    // Normalize mouse position relative to window center roughly
    const dx = (mousePos.x - window.innerWidth / 2) / 30;
    const dy = (mousePos.y - window.innerHeight / 2) / 30;
    
    return {
      x: Math.max(-limit, Math.min(limit, dx)),
      y: Math.max(-limit, Math.min(limit, dy))
    };
  };

  const leftEyeOffset = useMemo(() => calculateEyeOffset(-20, -50), [mousePos, isSleeping]);
  const rightEyeOffset = useMemo(() => calculateEyeOffset(20, -50), [mousePos, isSleeping]);

  // Determine Body Color based on Hygiene
  const bodyColor = stats.hygiene < 40 ? COLORS.skinDirty : COLORS.skin;
  
  return (
    <div 
      className="relative cursor-pointer select-none transition-transform duration-500 ease-spring"
      style={{ transform: `scale(${scale})` }}
      onClick={onClick}
    >
      <svg 
        width="300" 
        height="400" 
        viewBox="0 0 200 300" 
        className={`squishy ${mood === Mood.EATING ? 'scale-110' : ''}`}
        style={{ filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.2))' }}
      >
        {/* Legs / Feet Support Spheres - ROUNDER AND BIGGER */}
        <g className="animate-float" style={{ animationDelay: '0.2s' }}>
             <circle cx="60" cy="265" r="35" fill={bodyColor} stroke={COLORS.outline} strokeWidth="4" />
        </g>
        <g className="animate-float" style={{ animationDelay: '0.5s' }}>
            <circle cx="140" cy="265" r="35" fill={bodyColor} stroke={COLORS.outline} strokeWidth="4" />
        </g>

        {/* Main Body - The "Long" part */}
        <g className="animate-breathe origin-bottom">
          <ellipse 
            cx="100" 
            cy="150" 
            rx="60" 
            ry="130" 
            fill={bodyColor} 
            stroke={COLORS.outline} 
            strokeWidth="4"
          />
          
          {/* VEINS - Visible when showVeins is true */}
          <g opacity={showVeins ? 0.7 : 0} className="transition-opacity duration-500">
            <path d="M100,150 Q120,130 140,140" fill="none" stroke={COLORS.veins} strokeWidth="2" strokeLinecap="round" />
            <path d="M100,180 Q80,190 60,170" fill="none" stroke={COLORS.veins} strokeWidth="2" strokeLinecap="round" />
            <path d="M130,100 Q140,80 150,90" fill="none" stroke={COLORS.veins} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M70,120 Q50,110 40,130" fill="none" stroke={COLORS.veins} strokeWidth="1.5" strokeLinecap="round" />
            {/* Forehead Vein */}
            <path d="M90,60 Q100,50 110,60" fill="none" stroke={COLORS.veins} strokeWidth="2" />
          </g>
          
          {/* Belly Highlight */}
          <ellipse 
            cx="100" 
            cy="180" 
            rx="35" 
            ry="70" 
            fill={COLORS.belly} 
            opacity="0.5"
          />

          {/* Face Container */}
          <g transform="translate(100, 100)">
            
            {/* Eyes */}
            {isSleeping ? (
              // Sleeping Eyes (Closed)
              <g stroke="#333" strokeWidth="3" fill="none">
                 <path d="M-25,0 Q-15,10 -5,0" />
                 <path d="M5,0 Q15,10 25,0" />
                 <text x="30" y="-20" fontSize="24" className="animate-pulse">Zzz...</text>
              </g>
            ) : (
              // Awake Eyes
              <g>
                {/* Left Eye */}
                <circle cx="-20" cy="0" r="18" fill="white" stroke="#333" strokeWidth="2" />
                <circle cx={-20 + leftEyeOffset.x} cy={leftEyeOffset.y} r="6" fill="black" />
                
                {/* Right Eye */}
                <circle cx="20" cy="0" r="18" fill="white" stroke="#333" strokeWidth="2" />
                <circle cx={20 + rightEyeOffset.x} cy={rightEyeOffset.y} r="6" fill="black" />
              </g>
            )}

            {/* Mouth */}
            <g transform="translate(0, 30)">
               {mood === Mood.HAPPY && <path d="M-15,0 Q0,15 15,0" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />}
               {mood === Mood.SAD && <path d="M-15,10 Q0,-5 15,10" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />}
               {mood === Mood.EATING && <ellipse cx="0" cy="5" rx="15" ry="20" fill="#5c2e2e" />}
               {mood === Mood.ANGRY && <path d="M-10,0 L10,0" fill="none" stroke="#333" strokeWidth="3" />}
               {(mood === Mood.SLEEPY || mood === Mood.HAPPY) && !isSleeping && <path d="M-5,0 Q0,5 5,0" fill="none" stroke="#333" strokeWidth="3" />}
            </g>

            {/* Cheeks (Blush) */}
            {(mood === Mood.HAPPY || mood === Mood.EATING) && (
              <g fill="#ff7f7f" opacity="0.4">
                 <circle cx="-35" cy="15" r="10" />
                 <circle cx="35" cy="15" r="10" />
              </g>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
};