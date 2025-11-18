import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiMenu, FiPlayCircle, FiBookOpen } from "react-icons/fi";
import { HiLightningBolt } from "react-icons/hi";
import { MdAutoGraph } from "react-icons/md";
import { TbLayoutGrid } from "react-icons/tb";

// Song → Artist flashcard data
const flashcards = [
  { term: "Thriller", definition: "Michael Jackson" },
  { term: "Levitating", definition: "Dua Lipa" },
  { term: "You Belong with Me", definition: "Taylor Swift" },
  { term: "Uptown Funk", definition: "Bruno Mars" },
  { term: "Dangerous Woman", definition: "Ariana Grande" },
  { term: "Starboy", definition: "The Weeknd" },
  { term: "One Dance", definition: "Drake" },
  { term: "What Makes You Beautiful", definition: "One Direction" },
  { term: "Shape of You", definition: "Ed Sheeran" },
  { term: "Baby", definition: "Justin Bieber" },
];

function HomePage() {
  // just show the first card for now
  const [currentIndex] = useState(0);
  const currentCard = flashcards[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* --- TOP NAV --- */}
      <header className="w-full px-6 py-4 flex items-center bg-white shadow-sm">
        {/* Left: menu + logo (just a search icon like Quizlet) */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
            <FiMenu className="text-xl" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              Q
            </div>
          </div>
        </div>

        {/* Center: search bar */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xl flex items-center bg-gray-100 rounded-full px-4 py-2">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search for practice tests"
              className="flex-1 bg-transparent outline-none text-sm text-gray-700"
            />
          </div>
        </div>

        {/* Right: buttons + avatar */}
        <div className="flex items-center gap-4">
          <button className="px-3 py-1 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
            Save
          </button>
          <button className="px-3 py-1 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
            Groups
          </button>
          <button className="px-3 py-1 rounded-full border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">
            Share
          </button>
          <button className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold">
            +
          </button>
          <button className="px-4 py-2 rounded-full bg-yellow-400 text-sm font-semibold">
            Upgrade: free 7-day trial
          </button>
          <div className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
            S
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 px-8 py-6 flex flex-col items-center">
        {/* Set title */}
        <div className="w-full max-w-5xl mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">
            Songs to Artists
          </h1>
        </div>

        {/* Mode tiles */}
        <section className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {/* Flashcards */}
          <button className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 rounded-xl px-4 py-3 text-left">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <FiBookOpen />
            </div>
            <span className="text-sm font-medium text-gray-800">
              Flashcards
            </span>
          </button>

          {/* Learn */}
          <button className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 rounded-xl px-4 py-3 text-left">
            <div className="w-8 h-8 rounded-md bg-indigo-500 flex items-center justify-center text-white">
              <FiPlayCircle />
            </div>
            <span className="text-sm font-medium text-gray-800">Learn</span>
          </button>

          {/* Test */}
          <button className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 rounded-xl px-4 py-3 text-left">
            <div className="w-8 h-8 rounded-md bg-sky-500 flex items-center justify-center text-white">
              <TbLayoutGrid />
            </div>
            <span className="text-sm font-medium text-gray-800">Test</span>
          </button>

          {/* TimeClash (replaces Blocks) – links to App.js */}
          <Link
            to="/timeclash"
            className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 rounded-xl px-4 py-3 text-left"
          >
            <div className="w-8 h-8 rounded-md bg-purple-500 flex items-center justify-center text-white">
              <HiLightningBolt />
            </div>
            <span className="text-sm font-medium text-gray-800">TimeClash</span>
          </Link>

          {/* Blast */}
          <button className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 rounded-xl px-4 py-3 text-left">
            <div className="w-8 h-8 rounded-md bg-pink-500 flex items-center justify-center text-white">
              <MdAutoGraph />
            </div>
            <span className="text-sm font-medium text-gray-800">Blast</span>
          </button>

          {/* Match */}
          <button className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 rounded-xl px-4 py-3 text-left">
            <div className="w-8 h-8 rounded-md bg-teal-500 flex items-center justify-center text-white">
              <TbLayoutGrid />
            </div>
            <span className="text-sm font-medium text-gray-800">Match</span>
          </button>
        </section>

        {/* Flashcard area */}
        <section className="w-full max-w-5xl mt-4">
          <div className="bg-white rounded-3xl shadow-md px-8 py-8 min-h-[260px] flex flex-col">
            {/* Top row of card */}
            <div className="flex items-center justify-between mb-6">
              <button className="text-sm text-gray-500 flex items-center gap-2">
                <span role="img" aria-label="hint">
                  💡
                </span>
                <span>Get a hint</span>
              </button>
              <div className="flex items-center gap-4 text-gray-400">
                <button className="hover:text-gray-600 text-sm">✏️</button>
                <button className="hover:text-gray-600 text-sm">🔊</button>
                <button className="hover:text-gray-600 text-sm">★</button>
                <button className="hover:text-gray-600 text-sm">⋯</button>
              </div>
            </div>

            {/* Term */}
            <div className="flex-1 flex items-center justify-center">
              <p className="text-2xl sm:text-3xl text-gray-800 text-center">
                {currentCard.term}
              </p>
            </div>

            {/* (Optional) little footer text, e.g. "Song" */}
            <div className="mt-4 text-xs text-gray-400">
              Song → Artist set (answer: {currentCard.definition})
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;