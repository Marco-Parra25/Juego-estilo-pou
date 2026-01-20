import React from 'react';

interface PoopProps {
  id: number;
  x: number;
  y: number;
  onClean: (id: number) => void;
}

export const Poop: React.FC<PoopProps> = ({ id, x, y, onClean }) => {
  return (
    <div 
      className="absolute cursor-pointer hover:scale-110 transition-transform animate-bounce"
      style={{ left: `${x}%`, top: `${y}%`, zIndex: 20 }}
      onClick={(e) => {
        e.stopPropagation();
        onClean(id);
      }}
    >
      <div className="text-4xl filter drop-shadow-md">💩</div>
    </div>
  );
};