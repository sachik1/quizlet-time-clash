import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiMenu, FiPlayCircle, FiBookOpen } from "react-icons/fi";
import { HiLightningBolt } from "react-icons/hi";
import { MdAutoGraph } from "react-icons/md";
import { TbLayoutGrid } from "react-icons/tb";

// ---- Element → Symbol flashcards ----
const flashcards = [
  { term: "Silver", definition: "Ag" },
  { term: "Gold", definition: "Au" },
  { term: "Oxygen", definition: "O" },
  { term: "Helium", definition: "He" },
  { term: "Hydrogen", definition: "H" },
  { term: "Carbon", definition: "C" },
  { term: "Potassium", definition: "K" },
  { term: "Calcium", definition: "Ca" },
  { term: "Nitrogen", definition: "N" },
  { term: "Iron", definition: "Fe" },
];

function HomePage() {
  // just show the first card for now
  const [currentIndex] = useState(0);
  const currentCard = flashcards[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-bg via-app-bg-soft to-black text-text-main flex flex-col">
      {/* --- TOP NAV --- */}
      <header className="w-full px-6 py-4 flex items-center bg-nav-bg backdrop-blur-md border-b border-slate-800">
        {/* Left: menu + logo */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors">
            <FiMenu className="text-xl" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent-primary to-sky-400 flex items-center justify-center text-white font-bold shadow-card-glow">
              Q
            </div>
          </div>
        </div>

        {/* Center: search bar */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xl flex items-center bg-slate-900/60 border border-slate-700 rounded-full px-4 py-2 shadow-pill-soft">
            <FiSearch className="text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search for practice tests"
              className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Right: buttons + avatar */}
        <div className="flex items-center gap-3">
          <button className="px-3 py-1 rounded-full border border-slate-700 text-xs md:text-sm text-slate-200 bg-slate-900/40 hover:bg-slate-800 transition-colors">
            Save
          </button>
          <button className="px-3 py-1 rounded-full border border-slate-700 text-xs md:text-sm text-slate-200 bg-slate-900/40 hover:bg-slate-800 transition-colors">
            Groups
          </button>
          <button className="px-3 py-1 rounded-full border border-slate-700 text-xs md:text-sm text-slate-200 bg-slate-900/40 hover:bg-slate-800 transition-colors">
            Share
          </button>
          <button className="px-3 md:px-4 py-2 rounded-full bg-accent-primary text-white text-sm font-semibold shadow-pill-soft hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] transition-all">
            +
          </button>
          <button className="hidden md:inline-flex px-4 py-2 rounded-full bg-accent-gold text-slate-900 text-xs md:text-sm font-semibold shadow-pill-soft hover:brightness-110 transition-all">
            Upgrade: free 7-day trial
          </button>
          <div className="w-9 h-9 rounded-full bg-emerald-400 flex items-center justify-center text-slate-900 font-semibold shadow-card-glow">
            S
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 px-4 md:px-8 py-8 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          {/* Set title */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-semibold text-white">
              Songs to Artists
            </h1>
          </div>

          {/* Mode tiles */}
          <section className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
            {/* Flashcards */}
            <button className="flex items-center gap-3 bg-card-bg hover:bg-card-bg-alt rounded-2xl px-4 py-3 text-left border border-slate-800 shadow-card-glow transition-colors">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-primary to-sky-400 flex items-center justify-center text-white">
                <FiBookOpen />
              </div>
              <span className="text-sm font-medium text-slate-100">
                Flashcards
              </span>
            </button>

            {/* Learn */}
            <button className="flex items-center gap-3 bg-card-bg hover:bg-card-bg-alt rounded-2xl px-4 py-3 text-left border border-slate-800 shadow-card-glow transition-colors">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white">
                <FiPlayCircle />
              </div>
              <span className="text-sm font-medium text-slate-100">Learn</span>
            </button>

            {/* Test */}
            <button className="flex items-center gap-3 bg-card-bg hover:bg-card-bg-alt rounded-2xl px-4 py-3 text-left border border-slate-800 shadow-card-glow transition-colors">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white">
                <TbLayoutGrid />
              </div>
              <span className="text-sm font-medium text-slate-100">Test</span>
            </button>

            {/* TimeClash – links to mode select page (App.js) */}
            <Link
              to="/app"
              className="flex items-center gap-3 bg-card-bg hover:bg-card-bg-alt rounded-2xl px-4 py-3 text-left border border-slate-800 shadow-card-glow transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-purple-500 flex items-center justify-center text-white">
                <HiLightningBolt />
              </div>
              <span className="text-sm font-medium text-slate-100">
                TimeClash
              </span>
            </Link>

            {/* Blast */}
            <button className="flex items-center gap-3 bg-card-bg hover:bg-card-bg-alt rounded-2xl px-4 py-3 text-left border border-slate-800 shadow-card-glow transition-colors">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white">
                <MdAutoGraph />
              </div>
              <span className="text-sm font-medium text-slate-100">Blast</span>
            </button>

            {/* Match */}
            <button className="flex items-center gap-3 bg-card-bg hover:bg-card-bg-alt rounded-2xl px-4 py-3 text-left border border-slate-800 shadow-card-glow transition-colors">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white">
                <TbLayoutGrid />
              </div>
              <span className="text-sm font-medium text-slate-100">Match</span>
            </button>
          </section>

          {/* Flashcard area */}
          <section className="mt-4">
            <div className="bg-card-bg-alt/90 rounded-3xl shadow-card-glow border border-slate-800 px-6 md:px-8 py-8 min-h-[260px] flex flex-col">
              {/* Top row of card */}
              <div className="flex items-center justify-between mb-6">
                <button className="text-sm text-slate-400 flex items-center gap-2 hover:text-slate-200 transition-colors">
                  <span role="img" aria-label="hint">
                    💡
                  </span>
                  <span>Get a hint</span>
                </button>
                <div className="flex items-center gap-4 text-slate-500">
                  <button className="hover:text-slate-200 text-sm">✏️</button>
                  <button className="hover:text-slate-200 text-sm">🔊</button>
                  <button className="hover:text-slate-200 text-sm">★</button>
                  <button className="hover:text-slate-200 text-sm">⋯</button>
                </div>
              </div>

              {/* Term */}
              <div className="flex-1 flex items-center justify-center">
                <p className="text-2xl sm:text-3xl text-white text-center">
                  {currentCard.term}
                </p>
              </div>

              {/* Footer text */}
              <div className="mt-4 text-xs text-text-muted">
                Song → Artist set (answer: {currentCard.definition})
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
