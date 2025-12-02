import React from "react";
import {
  FiClock,
  FiVolumeX,
  FiSettings,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

// Fallback sample data
const fallbackResults = [
  { term: 'What is the element symbol of "Silver"?', attempts: 1 },
  { term: 'What is the element symbol of "Gold"?', attempts: 2 },
  { term: 'What is the element symbol of "Carbon"?', attempts: 3 },
  { term: 'What is the element symbol of "Potassium"?', attempts: 4 },
];

const fallbackPlayers = [
  {
    name: "you",
    initial: "Y",
    color: "bg-purple-500",
    firstTries: 3,
    totalCorrect: 5,
  },
  {
    name: "player_2",
    initial: "P",
    color: "bg-pink-500",
    firstTries: 2,
    totalCorrect: 4,
  },
  {
    name: "player_3",
    initial: "P",
    color: "bg-blue-500",
    firstTries: 1,
    totalCorrect: 3,
  },
  {
    name: "player_4",
    initial: "P",
    color: "bg-green-500",
    firstTries: 0,
    totalCorrect: 1,
  },
];

function getAttemptLabel(attempts) {
  if (attempts === 1) return "1st try";
  if (attempts === 2) return "2nd try";
  if (attempts === 3) return "3rd try";
  return "4+ tries";
}

function getAttemptColorClasses(attempts) {
  if (attempts === 1)
    return "text-emerald-300 bg-emerald-500/10 border border-emerald-400/40";
  if (attempts === 2)
    return "text-amber-300 bg-amber-500/10 border border-amber-400/40";
  if (attempts === 3)
    return "text-slate-200 bg-slate-600/20 border border-slate-500/40";
  return "text-rose-300 bg-rose-500/10 border border-rose-400/40";
}

export default function MultiplayerSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};

  // Results (filter only completed ones)
  const rawResults =
    state.results && state.results.length ? state.results : fallbackResults;

  const completedResults = rawResults.filter(
    (r) => r.attempts && r.attempts > 0
  );

  // Stats
  const statsFromState = state.stats;
  const totals = statsFromState
    ? {
        first: statsFromState.oneTry || 0,
        second: statsFromState.twoTries || 0,
        third: statsFromState.threeTries || 0,
        incorrect: statsFromState.fourPlus || 0,
      }
    : completedResults.reduce(
        (acc, q) => {
          if (q.attempts === 1) acc.first++;
          else if (q.attempts === 2) acc.second++;
          else if (q.attempts === 3) acc.third++;
          else acc.incorrect++;
          return acc;
        },
        { first: 0, second: 0, third: 0, incorrect: 0 }
      );

  const totalQuestions = rawResults.length;

  // Players + leaderboard (winner = most firstTries)
  const players =
    state.players && state.players.length ? state.players : fallbackPlayers;

  const sortedPlayers = [...players].sort(
    (a, b) => (b.firstTries || 0) - (a.firstTries || 0)
  );

  const timeDisplay = "0:00"; // end-of-game display

  const handlePlayAgain = () => {
    navigate("/multiplayer-game");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-bg via-app-bg-soft to-black text-text-main flex flex-col">
      {/* --- TOP BAR --- */}
      <header className="w-full px-6 py-4 flex items-center bg-nav-bg backdrop-blur-md border-b border-slate-800">
        {/* Left: logo + title */}
        <div
          className="flex items-center gap-2 flex-1 cursor-pointer group"
          onClick={handleGoHome}
        >
          <FiClock className="text-accent-primary text-2xl" />
          <span className="font-semibold text-lg text-white group-hover:text-accent-primary transition-colors">
            Time Clash
          </span>
          <FiChevronDown className="text-slate-400 text-xl group-hover:text-slate-200 transition-colors" />
        </div>

        {/* Center: always 0:00 */}
        <div className="flex-1 flex justify-center">
          <span className="text-sm font-semibold text-rose-400 tracking-wide">
            {timeDisplay}
          </span>
        </div>

        {/* Right: icons */}
        <div className="flex items-center justify-end gap-4 flex-1 text-slate-400">
          <FiVolumeX className="cursor-pointer hover:text-accent-primary transition-colors" />
          <FiSettings className="cursor-pointer hover:text-accent-primary transition-colors" />
          <FiX className="cursor-pointer hover:text-rose-400 transition-colors" />
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 px-4 md:px-10 py-8 flex flex-col items-center">
        <div className="w-full max-w-6xl flex flex-col gap-8">
          {/* Top row: stats bubble + leaderboard */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Stats speech bubble */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="border-[6px] border-accent-primary rounded-[36px] px-8 py-8 bg-card-bg-alt text-slate-100 shadow-card-glow min-w-[260px]">
                  <p className="text-sm mb-2">
                    <span className="font-semibold text-emerald-300">
                      {totals.first}/{totalQuestions}
                    </span>{" "}
                    questions –{" "}
                    <span className="text-emerald-300 font-semibold">
                      first try
                    </span>
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-semibold text-amber-300">
                      {totals.second}/{totalQuestions}
                    </span>{" "}
                    questions –{" "}
                    <span className="text-amber-300 font-semibold">
                      second try
                    </span>
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-semibold text-slate-200">
                      {totals.third}/{totalQuestions}
                    </span>{" "}
                    questions –{" "}
                    <span className="text-slate-200 font-semibold">
                      third try
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold text-rose-300">
                      {totals.incorrect}/{totalQuestions}
                    </span>{" "}
                    questions –{" "}
                    <span className="text-rose-300 font-semibold">
                      incorrect / 4+ tries
                    </span>
                  </p>
                </div>
                <div className="absolute -bottom-4 left-10 w-6 h-6 bg-card-bg-alt border-b-[6px] border-l-[6px] border-accent-primary rotate-45"></div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="flex-[2] bg-card-bg rounded-3xl shadow-card-glow px-6 md:px-10 py-8 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-white">
                  Multiplayer Results
                </h2>
                <span className="text-3xl">🏆</span>
              </div>

              <h3 className="text-xl font-bold mb-4 text-slate-100">
                Leaderboard
              </h3>

              <div className="flex flex-col gap-3">
                {sortedPlayers.map((p, index) => (
                  <div
                    key={p.name}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 border ${
                      index === 0
                        ? "bg-amber-500/10 border-amber-300/50"
                        : "bg-slate-900/50 border-slate-700/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-slate-100">
                        {index + 1}.
                      </span>
                      <div
                        className={`w-9 h-9 rounded-full ${
                          p.color || "bg-purple-500"
                        } flex items-center justify-center text-white font-semibold`}
                      >
                        {(p.initial || p.name[0] || "?").toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-slate-100">
                        {p.name}
                        {index === 0 && (
                          <span className="ml-2 text-xs text-amber-300 font-semibold">
                            (Winner)
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="text-sm text-slate-300">
                      {p.firstTries || 0}{" "}
                      {p.firstTries === 1
                        ? "first-try correct"
                        : "first-try correct answers"}
                      {" · "}
                      {p.totalCorrect || 0} total correct
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Question Summary */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-center mb-4 text-white">
              Question Summary:
            </h2>

            <div className="bg-card-bg-alt/90 rounded-3xl shadow-card-glow px-4 md:px-6 py-4 max-h-[320px] overflow-y-auto border border-slate-800">
              <div className="flex flex-col gap-4">
                {completedResults.map((q, idx) => {
                  const badgeClasses = getAttemptColorClasses(q.attempts);
                  return (
                    <div
                      key={idx}
                      className="border border-slate-700 rounded-2xl px-5 py-4 flex flex-col gap-2 bg-slate-900/40"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                          Term
                        </span>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeClasses}`}
                        >
                          {getAttemptLabel(q.attempts)}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-slate-100">
                        {q.term}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button className="px-6 py-2 rounded-full bg-slate-900/70 text-slate-200 text-sm font-medium border border-slate-600 hover:bg-slate-800 transition-colors">
                Share your score
              </button>
              <button
                className="px-6 py-2 rounded-full bg-accent-primary text-white text-sm font-semibold shadow-pill-soft hover:shadow-[0_0_24px_rgba(129,140,248,0.9)] transition-all"
                onClick={handlePlayAgain}
              >
                Play again
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
