import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function MatchAssistant() {
  const [squad, setSquad] = useState('');
  const [summary, setSummary] = useState('');
  const [performance, setPerformance] = useState(false);
  const [setPieces, setSetPieces] = useState(false);
  const [result, setResult] = useState('');

  const analyze = async () => {
    setResult('Working...');
    const res = await fetch('/api/match_analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        squad,
        summary,
        performance,
        set_pieces: setPieces,
      }),
    });
    const data = await res.json();
    if (res.ok) setResult(data.analysis);
    else setResult(data.error || 'Error');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 space-y-4">
        <h1 className="text-2xl font-bold">Match Assistant</h1>
        <textarea
          className="w-full border p-2" rows="4" placeholder="Paste squad JSON here..."
          value={squad}
          onChange={(e) => setSquad(e.target.value)}
        />
        <textarea
          className="w-full border p-2" rows="6" placeholder="Match summary..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={performance} onChange={e => setPerformance(e.target.checked)} />
            <span>Performance Mode</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={setPieces} onChange={e => setSetPieces(e.target.checked)} />
            <span>Include Set-Pieces</span>
          </label>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={analyze}>Analyze Match</button>
        {result && <div className="border p-4 whitespace-pre-wrap">{result}</div>}
      </div>
    </div>
  );
}
