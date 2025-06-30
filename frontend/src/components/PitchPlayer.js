import React from 'react';

export default function PitchPlayer({ player, onEdit, draggableProps }) {
  const handleClick = () => {
    const name = window.prompt('Player name:', player.name);
    const strengths = window.prompt('Strengths:', player.strengths || '');
    const weaknesses = window.prompt('Weaknesses:', player.weaknesses || '');
    if (name !== null) {
      onEdit({ ...player, name, strengths, weaknesses });
    }
  };

  return (
    <div
      className="cursor-move text-center"
      draggable
      onClick={handleClick}
      {...draggableProps}
    >
      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-1">
        <span className="font-bold">{player.number}</span>
      </div>
      <div className="text-xs text-white whitespace-nowrap">{player.name}</div>
    </div>
  );
}
