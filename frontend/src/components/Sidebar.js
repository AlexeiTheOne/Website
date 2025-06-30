import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { pathname } = useLocation();
  const linkClasses = (path) =>
    pathname === path
      ? 'block px-4 py-2 rounded bg-blue-600 text-white'
      : 'block px-4 py-2 rounded hover:bg-gray-200';

  return (
    <div className="w-48 bg-gray-100 p-4 space-y-2 min-h-screen">
      <Link to="/dashboard" className={linkClasses('/dashboard')}>Home</Link>
      <Link to="/dashboard/edit-squad" className={linkClasses('/dashboard/edit-squad')}>Edit Squad</Link>
      <Link to="/dashboard/match" className={linkClasses('/dashboard/match')}>Match Assistant</Link>
      <Link to="/dashboard/training" className={linkClasses('/dashboard/training')}>Training Assistant</Link>
      <Link to="/dashboard/pitch" className={linkClasses('/dashboard/pitch')}>Pitch Editor</Link>
      <Link to="/dashboard/squad" className={linkClasses('/dashboard/squad')}>Squadbook</Link>
      <Link to="/dashboard/settings" className={linkClasses('/dashboard/settings')}>Settings</Link>
      <a href="/logout" className="block px-4 py-2 text-red-600 hover:bg-gray-200 rounded">Logout</a>
    </div>
  );
}
