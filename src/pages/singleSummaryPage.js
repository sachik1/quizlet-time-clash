import React from "react";
import {
  FiClock,
  FiVolumeX,
  FiSettings,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { useLocation, useNavigate, Link } from "react-router-dom";

// Fallback sample data (used only if no state is passed)
const sampleResults = [
  { term: 'What is the element symbol of "Silver"?', attempts: 1 },
  { term: 'What is the element symbol of "Gold"?', attempts: 2 },
  { term: 'What is the element symbol of "Carbon"?', attempts: 3 },
  { term: 'What is the element symbol of "Potassium"?', attempts: 4 },
];

function getAttemptLabel(attempts) {
  if (attempts === 1) return "1st try";
  if (attempts === 2) return "2nd try";
  if (attempts === 3) return "3rd try";
  return "4+ tries";
}

function getAttemptColorClasses(attempts) {
  if (attempts === 1) return "text-emerald-300 bg-emerald-950/40 border-emerald-500/60";
  if (attempts === 2) return "text-amber-300 bg-amber-950/40 border-amber-500/60";
  if (attempts === 3) return "text-slate-200 bg-slate-900/50 border-slate-500/70";
  return "text-rose-300 bg-rose-950/40 border-rose-500/60";
}

export default function SingleSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Data from SinglePlayer (if available)
  const resultsFromState = location.state?.results;
  const statsFromState = location.state?.stats;
  // totalTime available if you ever want to display it differently
  const totalTime = location.state?.totalTime || 120; // seconds
  const timeDisplay = "0:00";

  // Use real results if present, otherwise fallback
  const results =
    resultsFromState && resultsFromState.length
      ? resultsFromState
      : sampleResults;

  // Only include questions that were actually completed (attempts > 0)
  const completedResults = results.filter((r) => r.attempts && r.attempts > 0);

  // Aggregate stats (from state if passed, otherwise compute)
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

  const totalQuestions = results.length;

  // ---- Leaderboard data ----
  const youFirstTries = totals.first;

  // Give “you” the highest first-try count; others get slightly less
  const leaderboardPlayers = [
    {
      name: "you",
      baseName: "you",
      time: timeDisplay,
      firstTries: youFirstTries,
      color: "bg-purple-500",
    },
    {
      name: "player_2",
      baseName: "player_2",
      time: "2:10",
      firstTries: Math.max(youFirstTries - 1, 0),
      color: "bg-pink-500",
    },
    {
      name: "player_3",
      baseName: "player_3",
      time: "2:14",
      firstTries: Math.max(youFirstTries - 2, 0),
      color: "bg-blue-500",
    },
    {
      name: "player_4",
      baseName: "player_4",
      time: "2:20",
      firstTries: Math.max(youFirstTries - 3, 0),
      color: "bg-green-500",
    },
  ];

  // Sort by number of first-try correct answers (winner at top)
  const sortedLeaderboard = [...leaderboardPlayers].sort(
    (a, b) => b.firstTries - a.firstTries
  );

  const handlePlayAgain = () => {
    navigate("/single-player");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-bg via-app-bg-soft to-black text-text-main flex flex-col">
      {/* --- TOP BAR --- */}
      <header className="w-full px-6 py-4 flex items-center bg-nav-bg backdrop-blur-md border-b border-slate-800">
        {/* Left: logo + title + chevron (click → homepage) */}
        <div className="flex items-center gap-2 flex-1">
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
        </div>

        {/* Center: final time (always 0:00) */}
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
          {/* Top row: speech bubble + leaderboard / message */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Speech bubble with stats */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                {/* Bubble outline */}
                <div className="border-[6px] border-accent-primary rounded-[36px] px-8 py-8 bg-card-bg shadow-card-glow min-w-[260px]">
                  <p className="text-sm mb-2 text-slate-100">
                    <span className="font-semibold text-accent-gold">
                      {totals.first}/{totalQuestions}
                    </span>{" "}
                    questions –{" "}
                    <span className="text-emerald-300 font-semibold">
                      first try
                    </span>
                  </p>
                  <p className="text-sm mb-2 text-slate-100">
                    <span className="font-semibold text-accent-gold">
                      {totals.second}/{totalQuestions}
                    </span>{" "}
                    questions –{" "}
                    <span className="text-amber-300 font-semibold">
                      second try
                    </span>
                  </p>
                  <p className="text-sm mb-2 text-slate-100">
                    <span className="font-semibold text-accent-gold">
                      {totals.third}/{totalQuestions}
                    </span>{" "}
                    questions –{" "}
                    <span className="text-slate-200 font-semibold">
                      third try
                    </span>
                  </p>
                  <p className="text-sm text-slate-100">
                    <span className="font-semibold text-accent-gold">
                      {totals.incorrect}/{totalQuestions}
                    </span>{" "}
                    questions –{" "}
                    <span className="text-rose-300 font-semibold">
                      incorrect
                    </span>
                  </p>
                </div>
                {/* Tail */}
                <div className="absolute -bottom-4 left-10 w-6 h-6 bg-card-bg border-b-[6px] border-l-[6px] border-accent-primary rotate-45" />
              </div>
            </div>

            {/* Congrats + leaderboard */}
            <div className="flex-[2] bg-card-bg-alt rounded-3xl shadow-card-glow px-6 md:px-10 py-8 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-white">
                  Congratulations! You finished the game.
                </h2>
                <span className="text-3xl">🎉</span>
              </div>

              <h3 className="text-xl font-bold mb-4 text-slate-100">
                Leaderboard
              </h3>

              {/* Leaderboard based on first-try correct answers */}
              <div className="flex flex-col gap-3">
                {sortedLeaderboard.map((p, index) => (
                  <div
                    key={p.baseName}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 border ${
                      index === 0
                        ? "bg-amber-900/40 border-amber-400/60"
                        : "bg-slate-900/60 border-slate-700/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-slate-100">
                        {index + 1}.
                      </span>
                      <div
                        className={`w-9 h-9 rounded-full ${
                          p.color
                        } flex items-center justify-center text-white font-semibold shadow-pill-soft`}
                      >
                        {p.name[0].toUpperCase()}
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
                      {p.time} · {p.firstTries}{" "}
                      {p.firstTries === 1
                        ? "first-try question"
                        : "first-try questions"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Question Summary section */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-center mb-4 text-white">
              Question Summary:
            </h2>

            {/* Scrollable list */}
            <div className="bg-card-bg-alt rounded-3xl shadow-card-glow px-4 md:px-6 py-4 max-h-[320px] overflow-y-auto border border-slate-800">
              <div className="flex flex-col gap-4">
                {completedResults.map((q, idx) => {
                  const badgeClasses = getAttemptColorClasses(q.attempts);
                  return (
                    <div
                      key={idx}
                      className="border border-slate-700 rounded-2xl px-5 py-4 flex flex-col gap-2 bg-slate-900/60"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                          Term
                        </span>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full border ${badgeClasses}`}
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

            {/* Bottom buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button className="px-6 py-2 rounded-full bg-slate-800 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors">
                Share your score
              </button>
              <button
                className="px-6 py-2 rounded-full bg-accent-primary text-white text-sm font-semibold hover:shadow-[0_0_24px_rgba(129,140,248,0.9)] transition-shadow"
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
