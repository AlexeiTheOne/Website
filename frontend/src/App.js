import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import EditSquad from './pages/EditSquad';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ Fixes the issue */}
      <Route path="/dashboard/edit-squad" element={<EditSquad />} />
    </Routes>
  );
}

export default App;
