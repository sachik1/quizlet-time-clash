import React from "react";
import {
  FiClock,
  FiChevronDown,
  FiVolumeX,
  FiSettings,
  FiX,
} from "react-icons/fi";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* --- NAVBAR --- */}
      <nav className="w-full px-6 py-4 flex items-center justify-between bg-white shadow-sm">
        {/* Left Section: Logo + Title */}
        <div className="flex items-center gap-2">
          <FiClock className="text-blue-600 text-2xl" />
          <span className="font-semibold text-lg">Time Clash</span>
          <FiChevronDown className="text-gray-600 text-xl cursor-pointer" />
        </div>

        {/* Right Section: Icons */}
        <div className="flex items-center gap-4 text-xl text-gray-600">
          <FiVolumeX className="cursor-pointer hover:text-gray-800" />
          <FiSettings className="cursor-pointer hover:text-gray-800" />
          <FiX className="cursor-pointer hover:text-gray-800" />
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-3xl font-bold mb-12">Select a Mode</h1>

        <div className="flex gap-12">
          {/* --- SINGLE PLAYER --- */}
          <Link to="/single-player">
            <div className="bg-blue-600 text-white w-72 h-72 rounded-xl flex justify-center items-center text-2xl font-semibold cursor-pointer border-4 border-blue-300 hover:scale-105 transition-transform">
              Single Player
            </div>
          </Link>

          {/* --- MULTIPLAYER --- */}
          <Link to="/invite">
            <div className="bg-blue-600 text-white w-72 h-72 rounded-xl flex justify-center items-center text-2xl font-semibold cursor-pointer border-4 border-blue-300 hover:scale-105 transition-transform">
              Multiplayer
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;