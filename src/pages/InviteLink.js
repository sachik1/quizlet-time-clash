import React from "react";
import {
  FiClock,
  FiChevronDown,
  FiVolumeX,
  FiSettings,
  FiX,
  FiCopy,
} from "react-icons/fi";
import { Link } from "react-router-dom";

export default function InviteLink() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* --- TOP BAR --- */}
      <header className="w-full px-6 py-4 flex items-center bg-white shadow-sm">
        {/* Left: logo + title */}
        <div className="flex items-center gap-2 flex-1">
          <FiClock className="text-blue-600 text-2xl" />
          <span className="font-semibold text-lg">Time Clash</span>
          <FiChevronDown className="text-gray-600 text-xl cursor-pointer" />
        </div>

        {/* Center: timer */}
        <div className="flex-1 flex justify-center">
          <span className="text-sm font-semibold text-gray-700 tracking-wide">
            0:00
          </span>
        </div>

        {/* Right: icons */}
        <div className="flex items-center justify-end gap-4 flex-1 text-gray-600">
          <FiVolumeX className="cursor-pointer hover:text-gray-800" />
          <FiSettings className="cursor-pointer hover:text-gray-800" />
          <FiX className="cursor-pointer hover:text-gray-800" />
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 px-8 py-10 flex flex-col items-center">
        {/* Invite Link box */}
        <section className="w-full max-w-3xl flex flex-col items-center mb-12">
          <h2 className="text-lg font-semibold mb-4">Invite Link</h2>

          <div className="w-full bg-gray-100 rounded-xl px-6 py-4 flex items-center justify-between">
            <a
              href="#"
              className="text-blue-600 underline break-all text-sm sm:text-base"
            >
              www.quizlet/time-clash/invite/ehfueher
            </a>
            <button className="ml-4 p-2 rounded-full hover:bg-gray-200 text-gray-600">
              <FiCopy className="text-lg" />
            </button>
          </div>
        </section>

        {/* Players row */}
        <section className="w-full max-w-3xl flex flex-col items-center mb-8">
          <h3 className="text-md font-semibold mb-4">Players</h3>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
              S
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
              N
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
              K
            </div>
          </div>
        </section>
      </main>

      {/* --- BOTTOM BAR --- */}
      <footer className="w-full bg-white border-t mt-auto">
        <div className="max-w-4xl mx-auto py-4 flex justify-center">
          <Link to="/multiplayer">
            <button className="px-8 py-2 rounded-full bg-blue-600 text-white font-semibold text-sm shadow hover:bg-blue-700">
              Start Game
            </button>
          </Link>
        </div>
      </footer>
    </div>
  );
}
