import React, { useEffect, useState } from 'react';
import Player from '../components/Player';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const defaultSquad = [
  { id: 1, name: 'GK', number: 1, position: 'GK', isBench: false },
  { id: 2, name: 'DEF1', number: 2, position: 'DEF', isBench: false },
  { id: 3, name: 'DEF2', number: 3, position: 'DEF', isBench: false },
  { id: 4, name: 'DEF3', number: 4, position: 'DEF', isBench: false },
  { id: 5, name: 'DEF4', number: 5, position: 'DEF', isBench: false },
  { id: 6, name: 'MID1', number: 6, position: 'MID', isBench: false },
  { id: 7, name: 'MID2', number: 7, position: 'MID', isBench: false },
  { id: 8, name: 'MID3', number: 8, position: 'MID', isBench: false },
  { id: 9, name: 'ATT1', number: 9, position: 'ATT', isBench: false },
  { id: 10, name: 'ATT2', number: 10, position: 'ATT', isBench: false },
  { id: 11, name: 'ATT3', number: 11, position: 'ATT', isBench: false },
  { id: 12, name: 'SUB1', number: 12, position: 'BENCH', isBench: true },
  { id: 13, name: 'SUB2', number: 13, position: 'BENCH', isBench: true },
  { id: 14, name: 'SUB3', number: 14, position: 'BENCH', isBench: true },
  { id: 15, name: 'SUB4', number: 15, position: 'BENCH', isBench: true },
  { id: 16, name: 'SUB5', number: 16, position: 'BENCH', isBench: true },
];

export default function EditSquad() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState(defaultSquad);

  useEffect(() => {
    fetch('/api/session')
      .then(res => res.json())
      .then(data => { if(!data.logged_in){ navigate('/login'); }});
  }, [navigate]);

  useEffect(() => {
    fetch('/api/load_squad')
      .then(res => res.json())
      .then(data => { if(data.squad){ setPlayers(data.squad); } });
  }, []);

  const updatePlayer = (updated) => {
    setPlayers(p => p.map(pl => pl.id === updated.id ? updated : pl));
  };

  const onDropZone = (e, zone) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('text/plain'));
    setPlayers(p => p.map(pl => pl.id === id ? { ...pl, position: zone, isBench: zone==='BENCH' } : pl));
  };

  const dragProps = (id) => ({
    onDragStart: (e) => e.dataTransfer.setData('text/plain', id)
  });

  const saveSquad = async () => {
    await fetch('/api/save_squad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ squad: players })
    });
    alert('Saved');
  };

  const renderZone = (zone) => (
    <div
      className="flex justify-center space-x-4 py-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDropZone(e, zone)}
    >
      {players.filter(p => p.position===zone && !p.isBench).map(p => (
        <Player key={p.id} player={p} onEdit={updatePlayer} draggableProps={dragProps(p.id)} />
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="p-4 max-w-xl mx-auto flex-1">
        <h1 className="text-center text-2xl font-bold mb-4">Edit Squad</h1>
        <div className="bg-green-700 rounded-lg p-2 mb-4">
          {renderZone('GK')}
          {renderZone('DEF')}
          {renderZone('MID')}
          {renderZone('ATT')}
        </div>
        <div
          className="bg-gray-700 p-2 rounded-lg flex flex-wrap justify-center space-x-4"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDropZone(e, 'BENCH')}
        >
          {players.filter(p => p.isBench).map(p => (
            <Player key={p.id} player={p} onEdit={updatePlayer} draggableProps={dragProps(p.id)} />
          ))}
        </div>
        <div className="text-center mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={saveSquad}>Save Squad</button>
        </div>
      </div>
    </div>
  );
}
