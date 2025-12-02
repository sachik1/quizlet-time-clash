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
import { useNavigate, Link } from "react-router-dom";

// Element → Symbol flashcard set
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

// Fisher–Yates shuffle
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function SinglePlayer() {
  const navigate = useNavigate();

  // 2 minutes = 120 seconds
  const [timeLeft, setTimeLeft] = useState(120);
  const [ended, setEnded] = useState(false);
  const [allQuestionsDone, setAllQuestionsDone] = useState(false);

  const [cards] = useState(() => flashcards);

  // random order to guarantee every card is seen once (no repeats)
  const [order] = useState(() =>
    shuffleArray([...Array(flashcards.length).keys()])
  );
  const [askedCount, setAskedCount] = useState(0); // how many distinct cards we've shown at least once

  // which index in `cards` is currently being asked
  const [currentCardIndex, setCurrentCardIndex] = useState(order[0]);

  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0); // attempts on current card
  const [feedback, setFeedback] = useState("");

  // stats by buckets
  const [stats, setStats] = useState({
    oneTry: 0,
    twoTries: 0,
    threeTries: 0,
    fourPlus: 0,
  });

  // per-question results for summary screen
  const [questionResults, setQuestionResults] = useState(() =>
    flashcards.map((card) => ({
      term: `What is the element symbol for "${card.term}"?`,
      attempts: 0, // 0 = never fully completed
    }))
  );

  // reveal state (show correct artist in middle)
  const [reveal, setReveal] = useState({
    visible: false,
    text: "",
  });

  const isOutOfTime = timeLeft <= 0;
  const currentCard = cards[currentCardIndex];

  // Timer countdown: stop if time is up OR game ended because questions finished
  useEffect(() => {
    if (timeLeft <= 0 || ended || allQuestionsDone) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, ended, allQuestionsDone]);

  // When time runs out OR all questions finished → go to summary (once)
  useEffect(() => {
    if ((timeLeft <= 0 || allQuestionsDone) && !ended) {
      setEnded(true);

      const finalStats = stats;
      const finalResults = questionResults;

      navigate("/single-summary", {
        state: {
          results: finalResults,
          stats: finalStats,
          totalTime: 120,
        },
      });
    }
  }, [timeLeft, allQuestionsDone, ended, navigate, stats, questionResults]);

  // Format as M:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const totalAnswered =
    stats.oneTry + stats.twoTries + stats.threeTries + stats.fourPlus;

  // choose next card:
  // - go through `order` so each card is seen once in random order
  // - when we've asked the last card, mark allQuestionsDone instead of repeating
  const moveToNextQuestion = () => {
    setFeedback("");
    setReveal({ visible: false, text: "" });

    setAskedCount((prevAsked) => {
      const nextAsked = prevAsked + 1;

      // if we've already shown the last card, end the question rotation
      if (nextAsked >= cards.length) {
        setAllQuestionsDone(true);
        return prevAsked; // keep index as-is; summary screen will trigger
      }

      // otherwise move to next card in random order
      const nextIndex = order[nextAsked];
      setCurrentCardIndex(nextIndex);

      return nextAsked;
    });

    setAttempts(0);
    setAnswer("");
  };

  const updateStatsAndResults = (resultAttempts) => {
    const alreadyRecorded =
      questionResults[currentCardIndex].attempts !== 0;

    // per-question results (store only the first completion)
    setQuestionResults((prev) => {
      const next = [...prev];
      if (!alreadyRecorded) {
        next[currentCardIndex] = {
          ...next[currentCardIndex],
          attempts: resultAttempts,
        };
      }
      return next;
    });

    // bucket stats (increment only first time)
    if (!alreadyRecorded) {
      setStats((prev) => {
        const s = { ...prev };
        if (resultAttempts === 1) s.oneTry += 1;
        else if (resultAttempts === 2) s.twoTries += 1;
        else if (resultAttempts === 3) s.threeTries += 1;
        else s.fourPlus += 1;
        return s;
      });
    }
  };

  // Reveal correct answer and then treat as 4+ tries, move on
  const revealAnswerAndAdvance = () => {
    if (!currentCard || reveal.visible) return;

    setReveal({
      visible: true,
      text: currentCard.definition,
    });

    // store as 4+ attempts for this question's first completion
    updateStatsAndResults(4);

    setTimeout(() => {
      if (!isOutOfTime && !allQuestionsDone) {
        moveToNextQuestion();
      }
    }, 1500);
  };

  const handleAnswer = () => {
    if (
      !answer.trim() ||
      isOutOfTime ||
      ended ||
      !currentCard ||
      reveal.visible
    )
      return;

    const user = answer.trim().toLowerCase();
    const correct = currentCard.definition.trim().toLowerCase();
    const newAttempts = attempts + 1;

    if (user === correct) {
      // classify based on attempts used
      if (newAttempts <= 3) {
        updateStatsAndResults(newAttempts);
      } else {
        updateStatsAndResults(4);
      }

      setFeedback("✅ Correct!");
      moveToNextQuestion();
    } else {
      // incorrect
      if (newAttempts >= 3) {
        // third attempt: reveal + move on
        setAttempts(newAttempts);
        setFeedback("");
        revealAnswerAndAdvance();
      } else {
        setAttempts(newAttempts);
        setFeedback("❌ Incorrect, try again.");
      }
    }
  };

  // "Don't know?" = immediately reveal and move on, counts as 4+ tries
  const handleDontKnow = () => {
    if (isOutOfTime || ended || !currentCard || reveal.visible) return;
    setFeedback("");
    revealAnswerAndAdvance();
  };

  const isAnswerDisabled =
    !answer.trim() ||
    isOutOfTime ||
    ended ||
    !currentCard ||
    reveal.visible;

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-bg via-app-bg-soft to-black text-text-main flex flex-col">
      {/* --- TOP BAR --- */}
      <header className="w-full px-6 py-4 flex items-center bg-nav-bg backdrop-blur-md border-b border-slate-800">
        {/* Left: logo + title (click → homepage) */}
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

        {/* Center: timer */}
        <div className="flex-1 flex justify-center">
          <span className="text-sm font-semibold text-accent-gold tracking-wide">
            {formattedTime}
          </span>
        </div>

        {/* Right: icons + avatar */}
        <div className="flex items-center justify-end gap-4 flex-1 text-slate-400">
          <FiVolumeX className="cursor-pointer hover:text-accent-primary transition-colors" />
          <FiSettings className="cursor-pointer hover:text-accent-primary transition-colors" />
          <FiX className="cursor-pointer hover:text-rose-400 transition-colors" />
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold shadow-pill-soft">
            S
          </div>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <main className="flex-1 px-4 md:px-8 py-6 flex flex-col items-center">
        {/* Stats bar */}
        <div className="w-full max-w-4xl text-sm mb-4 flex items-center gap-3">
          <span className="text-slate-400 mr-2">Questions Answered:</span>

          <span className="font-semibold text-emerald-400">
            {stats.oneTry}
          </span>
          <span className="text-slate-500">/</span>

          <span className="font-semibold text-amber-300">
            {stats.twoTries}
          </span>
          <span className="text-slate-500">/</span>

          <span className="font-semibold text-slate-200">
            {stats.threeTries}
          </span>
          <span className="text-slate-500">/</span>

          <span className="font-semibold text-rose-300">
            {stats.fourPlus}
          </span>

          <span className="ml-4 text-xs text-slate-500">
            (Total distinct completed: {totalAnswered}/{cards.length})
          </span>
        </div>

        {/* Card */}
        <section className="w-full max-w-4xl bg-card-bg-alt/90 rounded-3xl shadow-card-glow border border-slate-800 px-6 md:px-8 py-6">
          {/* Term + audio icon */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
              Term
            </span>
            <button className="p-2 rounded-full hover:bg-slate-800 text-slate-400">
              <FiVolume2 className="text-xl" />
            </button>
          </div>

          {/* Question / Reveal text */}
          <div className="mb-8 min-h-[60px] flex items-center justify-center">
            {isOutOfTime || ended || allQuestionsDone || !currentCard ? (
              <p className="text-lg text-slate-100 text-center">
                Time&apos;s up!
              </p>
            ) : reveal.visible ? (
              <p className="text-2xl text-white font-semibold text-center">
                Correct artist: {reveal.text}
              </p>
            ) : (
              <p className="text-lg text-slate-100 text-center">
                What is the element symbol for "{currentCard.term}"?
              </p>
            )}
          </div>

          {/* Answer input */}
          {!isOutOfTime &&
            !ended &&
            !allQuestionsDone &&
            currentCard &&
            !reveal.visible && (
              <>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-slate-400 mb-2">
                    Your answer
                  </label>
                  <input
                    type="text"
                    placeholder="Type the artist's name"
                    className="w-full rounded-xl border border-slate-700 px-4 py-3 text-slate-100 bg-slate-900/70 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                </div>

                {/* Attempts & feedback */}
                <p className="text-xs text-slate-500 mb-1">
                  Attempts: {attempts}/3
                </p>
                {feedback && (
                  <p className="text-xs mb-4 text-slate-300">{feedback}</p>
                )}
              </>
            )}

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-4">
            <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300">
              <FiFlag className="text-sm" />
            </button>

            {!isOutOfTime && !ended && !allQuestionsDone && currentCard && (
              <div className="flex items-center gap-4">
                <button
                  className="text-sm font-medium text-indigo-300 hover:text-indigo-200"
                  onClick={handleDontKnow}
                  disabled={reveal.visible}
                >
                  Don&apos;t know?
                </button>
                <button
                  onClick={handleAnswer}
                  disabled={isAnswerDisabled}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    isAnswerDisabled
                      ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                      : "bg-accent-primary text-white hover:shadow-[0_0_24px_rgba(129,140,248,0.9)]"
                  }`}
                >
                  Answer
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
