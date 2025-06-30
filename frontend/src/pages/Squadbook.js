import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function Squadbook() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch('/api/load_squad').then(res => res.json()).then(data => {
      if (data.squad) setPlayers(data.squad);
    });
  }, []);

  const editPlayer = (id) => {
    const p = players.find(pl => pl.id === id);
    const name = window.prompt('Name:', p.name);
    const number = window.prompt('Number:', p.number);
    if (name !== null && number !== null) {
      setPlayers(pls => pls.map(pl => pl.id === id ? { ...pl, name, number } : pl));
    }
  };

  const deletePlayer = (id) => {
    setPlayers(pls => pls.filter(pl => pl.id !== id));
  };

  const addPlayer = () => {
    const name = window.prompt('Name:');
    const number = window.prompt('Number:');
    if (!name || !number) return;
    const id = Math.max(0, ...players.map(p => p.id)) + 1;
    setPlayers([...players, { id, name, number, position: 'BENCH', isBench: true }]);
  };

  const save = async () => {
    await fetch('/api/save_squad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ squad: players }),
    });
    alert('Saved');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Squadbook</h1>
        <table className="w-full mb-4 border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Position</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {players.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.number}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.position}</td>
                <td className="p-2 space-x-2">
                  <button className="text-blue-600" onClick={() => editPlayer(p.id)}>Edit</button>
                  <button className="text-red-600" onClick={() => deletePlayer(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={addPlayer}>Add Player</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={save}>Save Squad</button>
        </div>
      </div>
    </div>
  );
}
