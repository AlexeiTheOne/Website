import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function TrainingAssistant() {
  const [players, setPlayers] = useState([]);
  const [choice, setChoice] = useState('');
  const [focus, setFocus] = useState('pressing');
  const [result, setResult] = useState('');

  useEffect(() => {
    fetch('/api/load_squad')
      .then(res => res.json())
      .then(data => {
        if (data.squad) setPlayers(data.squad);
      });
  }, []);

  const generate = async () => {
    setResult('Working...');
    const res = await fetch('/api/training', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choice, focus }),
    });
    const data = await res.json();
    if (res.ok) setResult(data.drills); else setResult(data.error || 'Error');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 space-y-4">
        <h1 className="text-2xl font-bold">Training Assistant</h1>
        <select className="border p-2" value={choice} onChange={e => setChoice(e.target.value)}>
          <option value="">Select player or position</option>
          {players.map(p => (
            <option key={p.id} value={p.name}>{p.name} ({p.position})</option>
          ))}
          <option value="GK">Goalkeepers</option>
          <option value="DEF">Defenders</option>
          <option value="MID">Midfielders</option>
          <option value="ATT">Attackers</option>
        </select>
        <select className="border p-2" value={focus} onChange={e => setFocus(e.target.value)}>
          <option value="pressing">Pressing</option>
          <option value="transitions">Transitions</option>
          <option value="possession">Possession</option>
          <option value="finishing">Finishing</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={generate}>Generate Drills</button>
        {result && <div className="border p-4 whitespace-pre-wrap">{result}</div>}
      </div>
    </div>
  );
}
