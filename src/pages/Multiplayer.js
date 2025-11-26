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
import { useNavigate } from "react-router-dom";

// ---- Song → Artist flashcards ----
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

// Shuffle helper (Fisher–Yates)
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Local multiplayer players
const PLAYERS = [
  { name: "Sachi", initial: "S", color: "bg-purple-600" },
  { name: "Nikhil", initial: "N", color: "bg-orange-500" },
  { name: "Anya", initial: "A", color: "bg-blue-600" },
  { name: "Kiran", initial: "K", color: "bg-indigo-500" },
];

export default function Multiplayer() {
  const navigate = useNavigate();

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

  // Player turn
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // Global stats
  const [stats, setStats] = useState({
    oneTry: 0,
    twoTries: 0,
    threeTries: 0,
    fourPlus: 0,
  });

  // Per-question results (for summary)
  const [questionResults, setQuestionResults] = useState(() =>
    flashcards.map((card) => ({
      term: `Who is the artist of the song "${card.term}"?`,
      attempts: 0, // 0 = never completed
    }))
  );

  // Per-player stats (to decide winner)
  const [playerStats, setPlayerStats] = useState(() =>
    PLAYERS.map((p) => ({
      ...p,
      firstTries: 0,
      totalCorrect: 0,
    }))
  );

  const isOutOfTime = timeLeft <= 0;
  const noMoreQuestions = currentQuestionIndex >= order.length;
  const gameOver = ended || isOutOfTime || noMoreQuestions;

  const currentCard =
    noMoreQuestions ? null : flashcards[order[currentQuestionIndex]];
  const currentPlayer = PLAYERS[currentPlayerIndex];

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

    // Per-player stats
    setPlayerStats((prev) => {
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

    setCurrentPlayerIndex((i) => (i + 1) % PLAYERS.length);
  };

  const handleAnswer = () => {
    if (gameOver || !currentCard || !answer.trim() || reveal) return;

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* --- TOP BAR --- */}
      <header className="w-full px-6 py-4 flex items-center bg-white shadow-sm">
        <div className="flex items-center gap-2 flex-1">
          <FiClock className="text-blue-600 text-2xl" />
          <span className="font-semibold text-lg">Time Clash</span>
          <FiChevronDown className="text-gray-600 text-xl cursor-pointer" />
        </div>

        <div className="flex-1 flex justify-center">
          <span className="text-sm font-semibold text-yellow-500 tracking-wide">
            {formattedTime}
          </span>
        </div>

        <div className="flex items-center justify-end gap-4 flex-1 text-gray-600">
          <div className="flex items-center gap-3 mr-4">
            <span className="text-sm text-gray-500">Player Turn:</span>
            <div
              className={`w-9 h-9 rounded-full ${currentPlayer.color} text-white flex items-center justify-center font-semibold`}
            >
              {currentPlayer.initial}
            </div>
          </div>
          <FiVolumeX className="cursor-pointer hover:text-gray-800" />
          <FiSettings className="cursor-pointer hover:text-gray-800" />
          <FiX className="cursor-pointer hover:text-gray-800" />
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 px-8 py-6 flex flex-col items-center">
        {/* Question index */}
        <div className="w-full max-w-4xl text-sm mb-2">
          <span className="text-gray-500 mr-2">Question:</span>
          <span className="text-blue-600 font-semibold">
            {Math.min(currentQuestionIndex + 1, order.length)}/{order.length}
          </span>
        </div>

        {/* Global stats */}
        <div className="w-full max-w-4xl text-sm mb-4 flex items-center gap-3">
          <span className="text-gray-500">Answered:</span>

          <span className="text-green-500 font-semibold">{stats.oneTry}</span>/
          <span className="text-yellow-500 font-semibold">
            {stats.twoTries}
          </span>
          /
          <span className="text-gray-500 font-semibold">
            {stats.threeTries}
          </span>
          /
          <span className="text-red-500 font-semibold">
            {stats.fourPlus}
          </span>

          <span className="ml-4 text-xs text-gray-400">
            ({totalAnswered}/{order.length})
          </span>
        </div>

        {/* Card */}
        <section className="w-full max-w-4xl bg-white rounded-2xl shadow-md px-8 py-6">
          {/* Top of card */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-500 uppercase">
              Term
            </span>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiVolume2 className="text-xl text-gray-500" />
            </button>
          </div>

          {/* Question / state text */}
          <div className="mb-8 min-h-[60px] flex items-center justify-center">
            {gameOver ? (
              <p className="text-lg text-center text-gray-800">
                {isOutOfTime ? "Time’s up!" : "All questions completed!"}
              </p>
            ) : reveal ? (
              <p className="text-2xl text-center font-semibold text-gray-800">
                Correct Answer: {reveal}
              </p>
            ) : (
              <p className="text-lg text-center text-gray-900">
                Who is the artist of the song "{currentCard.term}"?
              </p>
            )}
          </div>

          {/* Input / attempts */}
          {!gameOver && currentCard && !reveal && (
            <>
              <div className="mb-2">
                <label className="block text-sm text-gray-600 mb-1">
                  Your answer
                </label>
                <input
                  type="text"
                  placeholder="Type the artist's name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-600">Attempts: {attempts}/3</p>
              {feedback && (
                <p className="text-xs mt-1 mb-3 text-gray-700">{feedback}</p>
              )}
            </>
          )}

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-4">
            <button className="text-xs text-gray-400 hover:text-gray-600">
              <FiFlag />
            </button>

            {!gameOver && currentCard && !reveal && (
              <div className="flex items-center gap-4">
                <button
                  className="text-sm font-medium text-indigo-500 hover:text-indigo-600"
                  onClick={handleDontKnow}
                >
                  Don’t know?
                </button>
                <button
                  disabled={isAnswerDisabled}
                  onClick={handleAnswer}
                  className={`px-5 py-2 rounded-full text-sm font-semibold ${
                    isAnswerDisabled
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Answer
                </button>
              </div>
            )}

            {!gameOver && currentCard && reveal && (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700"
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
