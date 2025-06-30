import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function Settings() {
  const [tokenSaving, setTokenSaving] = useState(false);
  const [useMini, setUseMini] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setTokenSaving(localStorage.getItem('tokenSaving') === 'true');
    setUseMini(localStorage.getItem('useMini') === 'true');
  }, []);

  const savePrefs = () => {
    localStorage.setItem('tokenSaving', tokenSaving);
    localStorage.setItem('useMini', useMini);
    setMessage('Preferences saved');
  };

  const changePassword = async () => {
    if (!password) return;
    const res = await fetch('/api/change_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) setMessage('Password updated');
    else setMessage('Error updating password');
    setPassword('');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={tokenSaving} onChange={e => setTokenSaving(e.target.checked)} />
          <span>Token-saving mode</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={useMini} onChange={e => setUseMini(e.target.checked)} />
          <span>Use GPT-4o Mini</span>
        </label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={savePrefs}>Save Preferences</button>
        <div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="New password"
            className="border p-2 mr-2"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={changePassword}>Change Password</button>
        </div>
        <div>Current Plan: Free</div>
        {message && <div className="text-green-600">{message}</div>}
      </div>
    </div>
  );
}
