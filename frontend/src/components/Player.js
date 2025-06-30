import React from 'react';

export default function Player({ player, onEdit, draggableProps }) {
  const handleClick = () => {
    const name = window.prompt('Player name:', player.name);
    const number = window.prompt('Shirt number:', player.number);
    if (name !== null && number !== null) {
      onEdit({ ...player, name, number });
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
