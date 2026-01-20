import React from 'react';
import { FOOD_ITEMS } from '../constants';

interface ControlsProps {
  onDragStart: (e: React.PointerEvent, foodId: string) => void;
  onSleepToggle: () => void;
  onPlay: () => void;
  isSleeping: boolean;
  coins: number;
}

export const Controls: React.FC<ControlsProps> = ({ onDragStart, onSleepToggle, onPlay, isSleeping, coins }) => {
  const [activeTab, setActiveTab] = React.useState<'none' | 'food'>('none');

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md rounded-t-3xl border-t-4 border-blue-300 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-30">
      
      {/* Food Menu Overlay */}
      {activeTab === 'food' && (
        <div className="absolute bottom-full left-0 right-0 p-4 bg-white/90 border-t-4 border-orange-300 flex justify-around mb-2 rounded-t-2xl animate-slideUp">
           {FOOD_ITEMS.map((item) => (
             <button
               key={item.id}
               onPointerDown={(e) => {
                 if (coins >= item.cost) {
                    onDragStart(e, item.id);
                 }
               }}
               disabled={coins < item.cost}
               className={`flex flex-col items-center p-2 rounded-xl border-2 touch-none select-none ${coins >= item.cost ? 'border-orange-200 bg-orange-50 active:scale-95 cursor-grab' : 'border-gray-200 bg-gray-100 opacity-50'}`}
             >
               <span className="text-3xl pointer-events-none">{item.icon}</span>
               <span className="text-xs font-bold text-gray-600 pointer-events-none">${item.cost}</span>
             </button>
           ))}
        </div>
      )}

      {/* Main Buttons */}
      <div className="flex justify-between items-center max-w-md mx-auto">
        
        {/* Feed Button */}
        <button 
          onClick={() => setActiveTab(activeTab === 'food' ? 'none' : 'food')}
          className="flex flex-col items-center group"
          disabled={isSleeping}
        >
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center border-b-4 border-orange-300 group-active:border-b-0 group-active:translate-y-1 transition-all">
            <span className="text-3xl">🍔</span>
          </div>
          <span className="text-xs font-bold mt-1 text-gray-600">Feed</span>
        </button>

        {/* Play Button */}
        <button 
          onClick={onPlay}
          className="flex flex-col items-center group"
          disabled={isSleeping}
        >
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center border-b-4 border-blue-300 group-active:border-b-0 group-active:translate-y-1 transition-all">
            <span className="text-3xl">⚽</span>
          </div>
          <span className="text-xs font-bold mt-1 text-gray-600">Play</span>
        </button>

        {/* Sleep Button */}
        <button 
          onClick={onSleepToggle}
          className="flex flex-col items-center group"
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-b-4 transition-all group-active:border-b-0 group-active:translate-y-1 ${isSleeping ? 'bg-indigo-600 border-indigo-800' : 'bg-yellow-100 border-yellow-300'}`}>
            <span className="text-3xl">{isSleeping ? '💡' : '🛌'}</span>
          </div>
          <span className="text-xs font-bold mt-1 text-gray-600">Sleep</span>
        </button>

         {/* Coin Display (Not a button) */}
        <div className="flex flex-col items-center">
           <div className="h-16 px-4 bg-yellow-400 rounded-2xl flex items-center justify-center border-b-4 border-yellow-600">
            <span className="text-2xl font-black text-yellow-900 drop-shadow-sm flex gap-1">
              <span>💰</span>
              {coins}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};