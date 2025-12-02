// src/pages/Multiplayer.js
import React, { useState, useEffect } from "react";
import {
  FiClock,
  FiChevronDown,
  FiVolumeX,
  FiSettings,
  FiX,
  FiVolume2,
  FiFlag,
} from "react-icons/fi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getRoomByCode, subscribeToPlayers } from "../supabaseClient";

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

// Shuffle helper (Fisher–Yates)
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Colors to assign to players dynamically
const PLAYER_COLORS = [
  "bg-purple-600",
  "bg-orange-500",
  "bg-blue-600",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-pink-500",
];

export default function Multiplayer() {
  const navigate = useNavigate();
  const location = useLocation();

  // ---- ROOM + PLAYERS FROM SUPABASE ----
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]); // raw players from Supabase
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  const searchParams = new URLSearchParams(location.search);
  const roomCode = searchParams.get("room");

  useEffect(() => {
    if (!roomCode) return;

    let unsub = null;
    let isMounted = true;

    async function init() {
      try {
        setLoadingPlayers(true);
        const roomData = await getRoomByCode(roomCode);
        if (!isMounted) return;
        setRoom(roomData);

        // Subscribe to players in this room
        unsub = subscribeToPlayers(roomData.id, (list) => {
          if (!isMounted) return;
          setPlayers(list || []);
        });
      } catch (err) {
        console.error("Error loading multiplayer room:", err);
      } finally {
        if (isMounted) setLoadingPlayers(false);
      }
    }

    init();

    return () => {
      isMounted = false;
      if (unsub) unsub();
    };
  }, [roomCode]);

  // 2-minute timer
  const [timeLeft, setTimeLeft] = useState(120);
  const [ended, setEnded] = useState(false);

  // Random question order
  const [order] = useState(() =>
    shuffleArray([...Array(flashcards.length).keys()])
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Answer state
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [reveal, setReveal] = useState("");

  // Player turn (index into players[])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // Global stats (used for summary + "Answered" bar)
  const [stats, setStats] = useState({
    oneTry: 0,
    twoTries: 0,
    threeTries: 0,
    fourPlus: 0,
  });

  // Per-question results (for summary)
  const [questionResults, setQuestionResults] = useState(() =>
    flashcards.map((card) => ({
      term: `What is the element symbol for "${card.term}"?`,
      attempts: 0, // 0 = never completed
    }))
  );

  // Per-player stats (for winner / summary)
  const [playerStats, setPlayerStats] = useState([]);

  // Initialize playerStats once players load
  useEffect(() => {
    if (players.length === 0) return;
    // if already initialized with same length, don't reset mid-game
    if (playerStats.length === players.length) return;

    const initialized = players.map((p, idx) => ({
      id: p.id,
      name: p.name,
      initial: p.name?.charAt(0)?.toUpperCase() || "?",
      color: PLAYER_COLORS[idx % PLAYER_COLORS.length],
      firstTries: 0,
      totalCorrect: 0,
    }));
    setPlayerStats(initialized);
    setCurrentPlayerIndex(0);
  }, [players, playerStats.length]);

  const isOutOfTime = timeLeft <= 0;
  const noMoreQuestions = currentQuestionIndex >= order.length;
  const gameOver = ended || isOutOfTime || noMoreQuestions;

  const currentCard =
    noMoreQuestions ? null : flashcards[order[currentQuestionIndex]];

  const currentPlayer =
    players.length > 0
      ? {
          ...players[currentPlayerIndex],
          initial:
            players[currentPlayerIndex].name?.charAt(0)?.toUpperCase() || "?",
          color:
            PLAYER_COLORS[currentPlayerIndex % PLAYER_COLORS.length] ||
            "bg-gray-400",
        }
      : null;

  // TIMER
  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  // FLAG GAME AS ENDED WHEN TIME OR QUESTIONS RUN OUT
  useEffect(() => {
    if ((timeLeft <= 0 || noMoreQuestions) && !ended) {
      setEnded(true);
    }
  }, [timeLeft, noMoreQuestions, ended]);

  // WHEN GAME ENDS → NAVIGATE TO MULTIPLAYER SUMMARY
  useEffect(() => {
    if (!ended) return;

    navigate("/multiplayerSummaryPage", {
      state: {
        results: questionResults,
        stats,
        players: playerStats,
        totalTime: 120 - timeLeft,
      },
    });
  }, [ended, navigate, questionResults, stats, playerStats, timeLeft]);

  // TIMER DISPLAY
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const totalAnswered =
    stats.oneTry + stats.twoTries + stats.threeTries + stats.fourPlus;

  // Update stats for this question
  const updateStatsForQuestion = (resultAttempts, playerIndex, cardIndex) => {
    // Global stats
    setStats((prev) => {
      const s = { ...prev };
      if (resultAttempts === 1) s.oneTry += 1;
      else if (resultAttempts === 2) s.twoTries += 1;
      else if (resultAttempts === 3) s.threeTries += 1;
      else s.fourPlus += 1;
      return s;
    });

    // Question results (only first completion)
    setQuestionResults((prev) => {
      const updated = [...prev];
      if (updated[cardIndex].attempts === 0) {
        updated[cardIndex].attempts = resultAttempts;
      }
      return updated;
    });

    // Per-player stats: match by index
    setPlayerStats((prev) => {
      if (playerIndex >= prev.length) return prev;
      const updated = [...prev];
      const p = { ...updated[playerIndex] };

      if (resultAttempts <= 3) {
        p.totalCorrect += 1;
        if (resultAttempts === 1) p.firstTries += 1;
      }

      updated[playerIndex] = p;
      return updated;
    });
  };

  // Move to next question + rotate turn
  const advanceTurn = () => {
    setFeedback("");
    setReveal("");
    setAnswer("");
    setAttempts(0);

    setCurrentQuestionIndex((i) =>
      i + 1 < order.length ? i + 1 : order.length
    );

    // rotate through joined players
    setCurrentPlayerIndex((i) => {
      if (players.length === 0) return 0;
      return (i + 1) % players.length;
    });
  };

  const handleAnswer = () => {
    if (gameOver || !currentCard || !answer.trim() || reveal) return;
    if (players.length === 0) return; // no players yet

    const user = answer.trim().toLowerCase();
    const correct = currentCard.definition.trim().toLowerCase();
    const nextAttempts = attempts + 1;
    const cardIndex = order[currentQuestionIndex];

    if (user === correct) {
      updateStatsForQuestion(nextAttempts, currentPlayerIndex, cardIndex);
      setFeedback("✅ Correct!");
      advanceTurn();
    } else {
      if (nextAttempts >= 3) {
        updateStatsForQuestion(4, currentPlayerIndex, cardIndex);
        setReveal(currentCard.definition);
        setFeedback("❌ Incorrect. The correct answer is shown.");
        setAttempts(nextAttempts);
      } else {
        setAttempts(nextAttempts);
        setFeedback("❌ Incorrect, try again.");
      }
    }
  };

  const handleDontKnow = () => {
    if (gameOver || !currentCard || reveal) return;
    if (players.length === 0) return;

    const cardIndex = order[currentQuestionIndex];
    setReveal(currentCard.definition);
    updateStatsForQuestion(4, currentPlayerIndex, cardIndex);
  };

  const handleNextQuestion = () => {
    if (!gameOver) advanceTurn();
  };

  const isAnswerDisabled =
    gameOver || !currentCard || !answer.trim() || !!reveal;

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-bg via-app-bg-soft to-black text-text-main flex flex-col">
      {/* --- TOP BAR --- */}
      <header className="w-full px-6 py-4 flex items-center bg-nav-bg backdrop-blur-md border-b border-slate-800">
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

        <div className="flex-1 flex justify-center">
          <span className="text-sm font-semibold text-accent-gold tracking-wide">
            {formattedTime}
          </span>
        </div>

        <div className="flex items-center justify-end gap-4 flex-1 text-slate-400">
          <div className="flex items-center gap-3 mr-4">
            <span className="text-sm text-slate-400">Player Turn:</span>
            {currentPlayer ? (
              <div
                className={`w-9 h-9 rounded-full ${currentPlayer.color} text-white flex items-center justify-center font-semibold shadow-pill-soft`}
                title={currentPlayer.name}
              >
                {currentPlayer.initial}
              </div>
            ) : (
              <span className="text-xs text-slate-500">
                {loadingPlayers
                  ? "Loading players…"
                  : "Waiting for players to join"}
              </span>
            )}
          </div>
          <FiVolumeX className="cursor-pointer hover:text-accent-primary transition-colors" />
          <FiSettings className="cursor-pointer hover:text-accent-primary transition-colors" />
          <FiX className="cursor-pointer hover:text-rose-400 transition-colors" />
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 px-4 md:px-8 py-6 flex flex-col items-center">
        {/* Question index */}
        <div className="w-full max-w-4xl text-sm mb-2 flex items-center justify-between">
          <div>
            <span className="text-slate-400 mr-2">Question:</span>
            <span className="text-sky-300 font-semibold">
              {Math.min(currentQuestionIndex + 1, order.length)}/{order.length}
            </span>
          </div>
        </div>

        {/* Global stats bar */}
        <div className="w-full max-w-4xl text-sm mb-4 flex items-center gap-3">
          <span className="text-slate-400">Answered:</span>

          <span className="text-emerald-400 font-semibold">
            {stats.oneTry}
          </span>
          /
          <span className="text-amber-300 font-semibold">
            {stats.twoTries}
          </span>
          /
          <span className="text-slate-300 font-semibold">
            {stats.threeTries}
          </span>
          /
          <span className="text-rose-400 font-semibold">
            {stats.fourPlus}
          </span>

          <span className="ml-4 text-xs text-slate-500">
            ({totalAnswered}/{order.length})
          </span>
        </div>

        {/* Card */}
        <section className="w-full max-w-4xl bg-card-bg-alt/90 rounded-3xl shadow-card-glow border border-slate-800 px-6 md:px-8 py-6">
          {/* Top of card */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-400 uppercase">
              Term
            </span>
            <button className="p-2 rounded-full hover:bg-slate-800">
              <FiVolume2 className="text-xl text-slate-400" />
            </button>
          </div>

          {/* Question / state text */}
          <div className="mb-8 min-h-[60px] flex items-center justify-center">
            {gameOver ? (
              <p className="text-lg text-center text-slate-100">
                {isOutOfTime ? "Time’s up!" : "All questions completed!"}
              </p>
            ) : reveal ? (
              <p className="text-2xl text-center font-semibold text-white">
                Correct Answer: {reveal}
              </p>
            ) : currentCard ? (
              <p className="text-lg text-center text-slate-100">
                What is the element symbol for "{currentCard.term}"?
              </p>
            ) : (
              <p className="text-lg text-center text-slate-100">
                Waiting for question…
              </p>
            )}
          </div>

          {/* Input / attempts */}
          {!gameOver && currentCard && !reveal && (
            <>
              <div className="mb-2">
                <label className="block text-sm text-slate-400 mb-1">
                  Your answer
                </label>
                <input
                  type="text"
                  placeholder="Type the artist's name"
                  className="w-full rounded-xl border border-slate-700 px-4 py-3 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>
              <p className="text-xs text-slate-400">
                Attempts: {attempts}/3
              </p>
              {feedback && (
                <p className="text-xs mt-1 mb-3 text-slate-300">
                  {feedback}
                </p>
              )}
            </>
          )}

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-4">
            <button className="text-xs text-slate-500 hover:text-slate-300">
              <FiFlag />
            </button>

            {!gameOver && currentCard && !reveal && (
              <div className="flex items-center gap-4">
                <button
                  className="text-sm font-medium text-indigo-300 hover:text-indigo-200"
                  onClick={handleDontKnow}
                >
                  Don’t know?
                </button>
                <button
                  disabled={isAnswerDisabled}
                  onClick={handleAnswer}
                  className={`px-5 py-2 rounded-full text-sm font-semibold ${
                    isAnswerDisabled
                      ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                      : "bg-accent-primary text-white hover:shadow-[0_0_24px_rgba(129,140,248,0.9)]"
                  } transition-all`}
                >
                  Answer
                </button>
              </div>
            )}

            {!gameOver && currentCard && reveal && (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2 bg-accent-primary text-white rounded-full text-sm font-semibold hover:shadow-[0_0_24px_rgba(129,140,248,0.9)] transition-all"
              >
                Next question
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
