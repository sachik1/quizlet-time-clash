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
    <div className="min-h-screen bg-gradient-to-b from-app-bg via-app-bg-soft to-black text-text-main flex flex-col">
      {/* --- NAVBAR --- */}
      <nav className="w-full px-6 py-4 flex items-center justify-between bg-nav-bg backdrop-blur-md border-b border-slate-800">
        {/* Left Section: Logo + Title (clickable to go home) */}
        <Link
          to="/"
          className="flex items-center gap-2 cursor-pointer group"
        >
          <FiClock className="text-accent-primary text-2xl" />
          <span className="font-semibold text-lg text-white group-hover:text-accent-primary transition-colors">
            Time Clash
          </span>
          <FiChevronDown className="text-slate-400 text-xl group-hover:text-slate-200 transition-colors" />
        </Link>

        {/* Right Section: Icons */}
        <div className="flex items-center gap-4 text-xl text-slate-400">
          <FiVolumeX className="cursor-pointer hover:text-accent-primary transition-colors" />
          <FiSettings className="cursor-pointer hover:text-accent-primary transition-colors" />
          <FiX className="cursor-pointer hover:text-rose-400 transition-colors" />
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-white">
          Select a Mode
        </h1>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* --- SINGLE PLAYER --- */}
          <Link to="/single-player">
            <div className="bg-card-bg-alt/90 hover:bg-card-bg-alt w-72 h-72 rounded-3xl flex justify-center items-center text-2xl font-semibold cursor-pointer shadow-card-glow border border-slate-800 hover:border-accent-primary hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all duration-200">
              <span className="bg-gradient-to-r from-accent-primary to-sky-400 bg-clip-text text-transparent">
                Single Player
              </span>
            </div>
          </Link>

          {/* --- MULTIPLAYER (Fixed Path) --- */}
          <Link to="/multiplayer">
            <div className="bg-card-bg/90 hover:bg-card-bg w-72 h-72 rounded-3xl flex justify-center items-center text-2xl font-semibold cursor-pointer shadow-card-glow border border-slate-800 hover:border-accent-secondary hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] transition-all duration-200">
              <span className="bg-gradient-to-r from-emerald-400 to-accent-secondary bg-clip-text text-transparent">
                Multiplayer
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
