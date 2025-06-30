import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/session')
      .then(res => res.json())
      .then(data => {
        if (!data.logged_in) {
          navigate('/login');
        }
      });
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 bg-white">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to your dashboard</h1>
        <Link to="/dashboard/edit-squad" className="bg-blue-600 text-white px-4 py-2 rounded">
          Edit Squad
        </Link>
      </div>
    </div>
  );
}
