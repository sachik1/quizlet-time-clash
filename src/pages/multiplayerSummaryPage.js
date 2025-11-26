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
  { term: 'Who is the artist of the song "Thriller"?', attempts: 1 },
  { term: 'Who is the artist of the song "Levitating"?', attempts: 2 },
  { term: 'Who is the artist of the song "Shape of You"?', attempts: 3 },
  { term: 'Who is the artist of the song "Baby"?', attempts: 4 },
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
  if (attempts === 1) return "text-green-600 bg-green-50 border-green-200";
  if (attempts === 2) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  if (attempts === 3) return "text-gray-600 bg-gray-50 border-gray-200";
  return "text-red-600 bg-red-50 border-red-200";
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

        {/* Center: always 0:00 */}
        <div className="flex-1 flex justify-center">
          <span className="text-sm font-semibold text-red-500 tracking-wide">
            {timeDisplay}
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
      <main className="flex-1 px-10 py-8 flex flex-col items-center">
        <div className="w-full max-w-6xl flex flex-col gap-8">
          {/* Top row: stats bubble + leaderboard */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Stats speech bubble */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="border-[6px] border-blue-500 rounded-[36px] px-8 py-8 bg-white shadow-sm min-w-[260px]">
                  <p className="text-sm mb-2">
                    <span className="font-semibold">
                      {totals.first}/{totalQuestions}
                    </span>{" "}
                    questions –{" "}
                    <span className="text-green-600 font-semibold">
                      first try
                    </span>
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-semibold">
                      {totals.second}/{totalQuestions}
                    </span>{" "}
                    questions –{" "}
                    <span className="text-yellow-500 font-semibold">
                      second try
                    </span>
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-semibold">
                      {totals.third}/{totalQuestions}
                    </span>{" "}
                    questions –{" "}
                    <span className="text-gray-500 font-semibold">
                      third try
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">
                      {totals.incorrect}/{totalQuestions}
                    </span>{" "}
                    questions –{" "}
                    <span className="text-red-500 font-semibold">
                      incorrect / 4+ tries
                    </span>
                  </p>
                </div>
                <div className="absolute -bottom-4 left-10 w-6 h-6 bg-white border-b-[6px] border-l-[6px] border-blue-500 rotate-45"></div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="flex-[2] bg-white rounded-3xl shadow-sm px-10 py-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">
                  Multiplayer Results
                </h2>
                <span className="text-3xl">🏆</span>
              </div>

              <h3 className="text-xl font-bold mb-4">Leaderboard</h3>

              <div className="flex flex-col gap-3">
                {sortedPlayers.map((p, index) => (
                  <div
                    key={p.name}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
                      index === 0
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold">
                        {index + 1}.
                      </span>
                      <div
                        className={`w-9 h-9 rounded-full ${
                          p.color || "bg-purple-500"
                        } flex items-center justify-center text-white font-semibold`}
                      >
                        {(p.initial || p.name[0] || "?").toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {p.name}
                        {index === 0 && (
                          <span className="ml-2 text-xs text-yellow-600 font-semibold">
                            (Winner)
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
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
            <h2 className="text-2xl font-bold text-center mb-4">
              Question Summary:
            </h2>

            <div className="bg-white rounded-3xl shadow-sm px-6 py-4 max-h-[320px] overflow-y-auto">
              <div className="flex flex-col gap-4">
                {completedResults.map((q, idx) => {
                  const badgeClasses = getAttemptColorClasses(q.attempts);
                  return (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-2xl px-5 py-4 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Term
                        </span>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full border ${badgeClasses}`}
                        >
                          {getAttemptLabel(q.attempts)}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-900">
                        {q.term}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button className="px-6 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
                Share your score
              </button>
              <button
                className="px-6 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
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
