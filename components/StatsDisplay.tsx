import React from 'react';
import { Stats } from '../types';

interface StatsDisplayProps {
  stats: Stats;
}

const StatBar: React.FC<{ label: string; value: number; color: string; icon: string }> = ({ label, value, color, icon }) => (
  <div className="flex items-center w-full mb-2">
    <div className="w-8 text-xl mr-2">{icon}</div>
    <div className="flex-1">
      <div className="h-4 w-full bg-gray-300 rounded-full border-2 border-white shadow-sm overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500 ease-out`} 
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  </div>
);

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats }) => {
  return (
    <div className="absolute top-4 left-4 right-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border-4 border-white shadow-lg z-10 max-w-md mx-auto">
      <StatBar label="Hunger" value={stats.hunger} color="bg-orange-400" icon="🍗" />
      <StatBar label="Happy" value={stats.happiness} color="bg-pink-400" icon="❤️" />
      <StatBar label="Energy" value={stats.energy} color="bg-blue-400" icon="⚡" />
      <StatBar label="Hygiene" value={stats.hygiene} color="bg-teal-400" icon="🧼" />
    </div>
  );
};