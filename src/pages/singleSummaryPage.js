import React from "react";
import {
  FiClock,
  FiChevronDown,
  FiVolumeX,
  FiSettings,
  FiX,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

// Fallback sample data (used only if no state is passed)
const sampleResults = [
  { term: 'Who is the artist of the song "Thriller"?', attempts: 1 },
  { term: 'Who is the artist of the song "Levitating"?', attempts: 2 },
  { term: 'Who is the artist of the song "Shape of You"?', attempts: 3 },
  { term: 'Who is the artist of the song "Baby"?', attempts: 4 },
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

export default function SingleSummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Data from SinglePlayer (if available)
  const resultsFromState = location.state?.results;
  const statsFromState = location.state?.stats;
  const totalTime = location.state?.totalTime || 120; // seconds

  // Use real results if present, otherwise fallback
  const results = resultsFromState && resultsFromState.length
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
  const timeMinutes = Math.floor(totalTime / 60);
  const timeSeconds = totalTime % 60;
  const timeDisplay = `${timeMinutes}:${timeSeconds.toString().padStart(2, "0")}`;

  const handlePlayAgain = () => {
    // Just send them back to the single-player screen
    navigate("/single-player");
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

        {/* Center: final time (red, like screenshot) */}
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
          {/* Top row: speech bubble + leaderboard / message */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Speech bubble with stats */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                {/* Bubble outline */}
                <div className="border-[6px] border-blue-500 rounded-[36px] px-8 py-8 bg-white shadow-sm min-w-[260px]">
                  <p className="text-sm mb-2">
                    <span className="font-semibold">
                      {totals.first}/{totalQuestions}
                    </span>{" "}
                    questions -{" "}
                    <span className="text-green-600 font-semibold">
                      first try
                    </span>
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-semibold">
                      {totals.second}/{totalQuestions}
                    </span>{" "}
                    questions -{" "}
                    <span className="text-yellow-500 font-semibold">
                      second try
                    </span>
                  </p>
                  <p className="text-sm mb-2">
                    <span className="font-semibold">
                      {totals.third}/{totalQuestions}
                    </span>{" "}
                    questions -{" "}
                    <span className="text-gray-500 font-semibold">
                      third try
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">
                      {totals.incorrect}/{totalQuestions}
                    </span>{" "}
                    questions -{" "}
                    <span className="text-red-500 font-semibold">
                      incorrect
                    </span>
                  </p>
                </div>
                {/* Tail */}
                <div className="absolute -bottom-4 left-10 w-6 h-6 bg-white border-b-[6px] border-l-[6px] border-blue-500 rotate-45"></div>
              </div>
            </div>

            {/* Congrats + leaderboard */}
            <div className="flex-[2] bg-white rounded-3xl shadow-sm px-10 py-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">
                  Congratulations! You finished the game.
                </h2>
                <span className="text-3xl">🎉</span>
              </div>

              <h3 className="text-xl font-bold mb-4">Leaderboard</h3>

              {/* Simple static leaderboard for now */}
              <div className="flex flex-col gap-3">
                {[
                  { name: "you", time: `${timeDisplay}`, place: 1 },
                  { name: "player_2", time: "2:10", place: 2 },
                  { name: "player_3", time: "2:14", place: 3 },
                  { name: "player_4", time: "2:20", place: 4 },
                ].map((p) => (
                  <div
                    key={p.place}
                    className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold">
                        {p.place}.
                      </span>
                      <div className="w-9 h-9 rounded-full bg-purple-400 flex items-center justify-center text-white font-semibold">
                        {p.name[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {p.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Question Summary section */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-center mb-4">
              Question Summary:
            </h2>

            {/* Scrollable list */}
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

            {/* Bottom buttons */}
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
