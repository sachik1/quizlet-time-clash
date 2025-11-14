import React from "react";
import {
  FiClock,
  FiChevronDown,
  FiVolumeX,
  FiSettings,
  FiX,
  FiVolume2,
  FiFlag,
} from "react-icons/fi";

export default function SinglePlayer() {
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
          <span className="text-sm font-semibold text-yellow-500 tracking-wide">
            1:00
          </span>
        </div>

        {/* Right: icons + avatar */}
        <div className="flex items-center justify-end gap-4 flex-1 text-gray-600">
          <FiVolumeX className="cursor-pointer hover:text-gray-800" />
          <FiSettings className="cursor-pointer hover:text-gray-800" />
          <FiX className="cursor-pointer hover:text-gray-800" />
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold shadow">
            S
          </div>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <main className="flex-1 px-8 py-6 flex flex-col items-center">
        {/* Questions answered bar */}
        <div className="w-full max-w-4xl text-sm mb-4">
          <span className="text-gray-500 mr-2">Questions Answered:</span>
          <span className="font-semibold text-green-500 mr-1">5</span>
          <span className="text-gray-500">/</span>
          <span className="font-semibold text-yellow-500 mx-1">6</span>
          <span className="text-gray-500">/</span>
          <span className="font-semibold text-red-500 mx-1">2</span>
          <span className="text-gray-500">/</span>
          <span className="font-semibold text-gray-400 ml-1">4</span>
        </div>

        {/* Card */}
        <section className="w-full max-w-4xl bg-white rounded-2xl shadow-md px-8 py-6">
          {/* Term + audio icon */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Term
            </span>
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <FiVolume2 className="text-xl" />
            </button>
          </div>

          {/* Question text */}
          <p className="text-lg text-gray-900 mb-8">
            The “criteria for testing” an application is its “functional-spec”
            (True or False)
          </p>

          {/* Answer input */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Your answer
            </label>
            <input
              type="text"
              placeholder="Type the answer"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            />
          </div>

          {/* Attempts */}
          <p className="text-xs text-gray-500 mb-4">Attempts: 2/3</p>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-4">
            <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600">
              <FiFlag className="text-sm" />
            </button>

            <div className="flex items-center gap-4">
              <button className="text-sm font-medium text-indigo-500 hover:text-indigo-600">
                Don&apos;t know?
              </button>
              <button
                disabled
                className="px-5 py-2 rounded-full bg-gray-200 text-gray-400 text-sm font-semibold cursor-not-allowed"
              >
                Answer
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
