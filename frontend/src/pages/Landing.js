import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-600 via-blue-500 to-sky-400 text-white flex items-center justify-center px-6">
      {/* Background Image Overlay */}
    <div className="absolute inset-0 bg-[url('/images/background.png')] bg-cover bg-center opacity-20 z-0"></div>


      {/* Content */}
      <div className="z-10 text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
          Welcome to <span className="text-white underline underline-offset-4">TacticalOracle</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 text-white/90">
          The AI assistant built to help football coaches and players analyze matches, understand tactics, and improve with data.
        </p>
        <Link
          to="/register"
          className="bg-white text-blue-700 font-bold py-3 px-8 rounded-full shadow-xl hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
