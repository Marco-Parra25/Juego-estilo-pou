import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Character } from './components/Character';
import { StatsDisplay } from './components/StatsDisplay';
import { Controls } from './components/Controls';
import { Poop } from './components/Poop';
import { Mood, Stats, Particle } from './types';
import { TICK_RATE_MS, DECAY_RATES, FOOD_ITEMS } from './constants';

const INITIAL_STATS: Stats = {
  hunger: 80,
  happiness: 80,
  energy: 100,
  hygiene: 100,
};

// State for dragging item
interface DragItem {
  id: string;
  x: number;
  y: number;
  icon: string;
}

const App: React.FC = () => {
  // --- State ---
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);
  const [coins, setCoins] = useState<number>(100);
  const [isSleeping, setIsSleeping] = useState<boolean>(false);
  const [mood, setMood] = useState<Mood>(Mood.HAPPY);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [poops, setPoops] = useState<{ id: number; x: number; y: number }[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // New States for requested features
  const [characterSize, setCharacterSize] = useState<number>(1);
  const [showVeins, setShowVeins] = useState<boolean>(false);
  const [dragItem, setDragItem] = useState<DragItem | null>(null);

  // Refs for loop management
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const poopIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const veinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Helpers ---
  const spawnParticle = (x: number, y: number, emoji: string) => {
    const id = Date.now() + Math.random();
    setParticles(prev => [...prev, { id, x, y, emoji }]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 1000); // Remove after 1s
  };

  const updateMood = useCallback(() => {
    if (stats.energy < 20) return setMood(Mood.SLEEPY);
    if (stats.hunger < 30) return setMood(Mood.SAD);
    if (stats.hygiene < 40) return setMood(Mood.SAD);
    if (stats.happiness < 30) return setMood(Mood.ANGRY);
    setMood(Mood.HAPPY);
  }, [stats]);

  // --- Game Loop (Decay) ---
  useEffect(() => {
    gameLoopRef.current = setInterval(() => {
      if (isSleeping) {
        // Recover energy while sleeping
        setStats(prev => ({
          ...prev,
          energy: Math.min(100, prev.energy + 5),
          hunger: Math.max(0, prev.hunger - 0.5), // Slower hunger decay
        }));
      } else {
        // Decay stats
        setStats(prev => ({
          hunger: Math.max(0, prev.hunger - DECAY_RATES.hunger),
          happiness: Math.max(0, prev.happiness - DECAY_RATES.happiness),
          energy: Math.max(0, prev.energy - DECAY_RATES.energy),
          hygiene: Math.max(0, prev.hygiene - DECAY_RATES.hygiene),
        }));
        
        // Slowly shrink back if huge
        setCharacterSize(prev => Math.max(1, prev - 0.001));
      }
    }, TICK_RATE_MS);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isSleeping]);

  // --- Poop Generation ---
  useEffect(() => {
    poopIntervalRef.current = setInterval(() => {
      if (!isSleeping && stats.hunger > 0) {
        // Random chance to poop
        if (Math.random() > 0.7) {
            const x = 10 + Math.random() * 80; // keep within bounds
            const y = 60 + Math.random() * 20;
            setPoops(prev => [...prev, { id: Date.now(), x, y }]);
            setStats(prev => ({...prev, hygiene: Math.max(0, prev.hygiene - 10) }));
        }
      }
    }, 10000); // Check every 10s

    return () => {
      if (poopIntervalRef.current) clearInterval(poopIntervalRef.current);
    };
  }, [isSleeping, stats.hunger]);

  useEffect(() => {
    updateMood();
  }, [stats, updateMood]);

  // --- Drag Handling ---

  const handlePointerMove = (e: React.PointerEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    
    if (dragItem) {
      setDragItem(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
    }
  };

  const handleDragStart = (e: React.PointerEvent, foodId: string) => {
    if (isSleeping) return;
    const food = FOOD_ITEMS.find(f => f.id === foodId);
    if (!food) return;

    // Must have the element captured to track movement outside original bounds
    (e.target as Element).setPointerCapture(e.pointerId);

    setDragItem({
      id: foodId,
      x: e.clientX,
      y: e.clientY,
      icon: food.icon
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragItem) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const dist = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));

    // Threshold for dropping food on character (150px radius)
    if (dist < 150) {
      consumeFood(dragItem.id);
    }
    
    setDragItem(null);
  };

  const consumeFood = (foodId: string) => {
    const food = FOOD_ITEMS.find(f => f.id === foodId);
    if (!food) return;

    if (coins >= food.cost) {
      setCoins(prev => prev - food.cost);
      setStats(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + food.restore) }));
      setMood(Mood.EATING);
      spawnParticle(window.innerWidth / 2, window.innerHeight / 2, food.icon);
      
      // GROWTH & VEINS EFFECTS
      setCharacterSize(prev => Math.min(1.5, prev + 0.1)); // Grow up to 1.5x
      setShowVeins(true);
      
      // Reset mood and veins after a delay
      setTimeout(() => updateMood(), 1000);
      
      if (veinTimeoutRef.current) clearTimeout(veinTimeoutRef.current);
      veinTimeoutRef.current = setTimeout(() => {
        setShowVeins(false);
      }, 2000);
    }
  };

  // --- Interaction Handlers ---

  const handlePet = () => {
    if (isSleeping) return;
    setStats(prev => ({ ...prev, happiness: Math.min(100, prev.happiness + 5) }));
    setMood(Mood.HAPPY);
    spawnParticle(window.innerWidth / 2, window.innerHeight / 2 - 50, '❤️');
    
    // Quick mood reset
    setTimeout(updateMood, 1500);
  };

  const handleCleanPoop = (id: number) => {
    setPoops(prev => prev.filter(p => p.id !== id));
    setStats(prev => ({ ...prev, hygiene: Math.min(100, prev.hygiene + 15) }));
    setCoins(prev => prev + 5); // Reward for cleaning
    spawnParticle(mousePos.x, mousePos.y, '✨');
  };

  const handleSleepToggle = () => {
    setIsSleeping(!isSleeping);
    setMood(isSleeping ? Mood.HAPPY : Mood.SLEEPY); // Visual feedback immediately
  };

  // Simple "Play"
  const handlePlay = () => {
     if (stats.energy < 20) {
         spawnParticle(window.innerWidth/2, window.innerHeight/2, '😴');
         return;
     }
     setCoins(prev => prev + 10);
     setStats(prev => ({ 
         ...prev, 
         energy: Math.max(0, prev.energy - 10),
         happiness: Math.min(100, prev.happiness + 10)
     }));
     spawnParticle(window.innerWidth/2, window.innerHeight/2, '⚽');
  };

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden transition-colors duration-1000 touch-none ${isSleeping ? 'bg-indigo-950' : 'bg-blue-200'}`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      // Prevent default touch actions to allow dragging without scrolling
      style={{ touchAction: 'none' }} 
    >
      {/* Background Decor */}
      {!isSleeping && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute bottom-0 w-full h-1/3 bg-green-300 rounded-t-[50px] transform scale-110"></div>
          <div className="absolute top-10 left-10 w-24 h-24 bg-white/30 rounded-full blur-2xl"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
        </div>
      )}
      
      {/* Night Overlay */}
      {isSleeping && (
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none flex items-center justify-center">
            <div className="text-white text-6xl opacity-20 animate-pulse font-bold">Zzz...</div>
        </div>
      )}

      {/* UI Elements */}
      <StatsDisplay stats={stats} />

      {/* Poops on floor */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {poops.map(poop => (
          <div key={poop.id} className="pointer-events-auto">
             <Poop id={poop.id} x={poop.x} y={poop.y} onClean={handleCleanPoop} />
          </div>
        ))}
      </div>

      {/* Main Character */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Character 
            mood={mood} 
            stats={stats} 
            mousePos={mousePos} 
            onClick={handlePet}
            isSleeping={isSleeping}
            scale={characterSize}
            showVeins={showVeins}
        />
      </div>

      {/* Floating Particles (Feedback) */}
      {particles.map(p => (
        <div 
            key={p.id}
            className="absolute text-4xl pointer-events-none animate-bounce"
            style={{ 
                left: p.x, 
                top: p.y, 
                zIndex: 50,
                animation: 'float 1s ease-out forwards',
                opacity: 0 
            }}
        >
            {p.emoji}
        </div>
      ))}

      {/* Dragged Food Item */}
      {dragItem && (
        <div 
          className="absolute text-6xl pointer-events-none z-[100] transition-transform"
          style={{ 
            left: dragItem.x, 
            top: dragItem.y,
            transform: 'translate(-50%, -50%) scale(1.2)'
          }}
        >
          {dragItem.icon}
        </div>
      )}

      {/* Controls */}
      <Controls 
        onDragStart={handleDragStart} 
        onSleepToggle={handleSleepToggle} 
        onPlay={handlePlay}
        isSleeping={isSleeping} 
        coins={coins}
      />
    </div>
  );
};

export default App;