import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import PitchPlayer from '../components/PitchPlayer';

const defaultPitch = [
  { id: 1, name: 'GK', number: 1, position: 'GK' },
  { id: 2, name: 'DEF1', number: 2, position: 'DEF' },
  { id: 3, name: 'DEF2', number: 3, position: 'DEF' },
  { id: 4, name: 'MID1', number: 4, position: 'MID' },
  { id: 5, name: 'MID2', number: 5, position: 'MID' },
  { id: 6, name: 'ATT1', number: 6, position: 'ATT' },
];

export default function PitchEditor() {
  const [players, setPlayers] = useState(defaultPitch);

  useEffect(() => {
    fetch('/api/load_pitch')
      .then(res => res.json())
      .then(data => { if (data.pitch) setPlayers(data.pitch); });
  }, []);

  const updatePlayer = (updated) => {
    setPlayers(p => p.map(pl => pl.id === updated.id ? updated : pl));
  };

  const onDropZone = (e, zone) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('text/plain'));
    setPlayers(p => p.map(pl => pl.id === id ? { ...pl, position: zone } : pl));
  };

  const dragProps = (id) => ({
    onDragStart: (e) => e.dataTransfer.setData('text/plain', id)
  });

  const save = async () => {
    await fetch('/api/save_pitch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pitch: players }),
    });
    alert('Saved');
  };

  const renderZone = (zone) => (
    <div
      className="flex justify-center space-x-4 py-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDropZone(e, zone)}
    >
      {players.filter(p => p.position===zone).map(p => (
        <PitchPlayer key={p.id} player={p} onEdit={updatePlayer} draggableProps={dragProps(p.id)} />
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Pitch Editor</h1>
        <div className="bg-green-700 rounded-lg p-2 mb-4 text-white">
          {renderZone('GK')}
          {renderZone('DEF')}
          {renderZone('MID')}
          {renderZone('ATT')}
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={save}>Save Formation</button>
      </div>
    </div>
  );
}
