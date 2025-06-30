import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import EditSquad from './pages/EditSquad';
import MatchAssistant from './pages/MatchAssistant';
import TrainingAssistant from './pages/TrainingAssistant';
import PitchEditor from './pages/PitchEditor';
import Squadbook from './pages/Squadbook';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/edit-squad" element={<EditSquad />} />
      <Route path="/dashboard/match" element={<MatchAssistant />} />
      <Route path="/dashboard/training" element={<TrainingAssistant />} />
      <Route path="/dashboard/pitch" element={<PitchEditor />} />
      <Route path="/dashboard/squad" element={<Squadbook />} />
      <Route path="/dashboard/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
