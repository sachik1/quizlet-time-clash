// src/pages/InviteLink.js
import React, { useEffect, useState } from "react";
import {
  FiClock,
  FiChevronDown,
  FiVolumeX,
  FiSettings,
  FiX,
  FiCopy,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  createRoom,
  getRoomByCode,
  joinRoom,
  subscribeToPlayers,
} from "../supabaseClient";

export default function InviteLink() {
  const location = useLocation();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copyStatus, setCopyStatus] = useState("");
  const [error, setError] = useState(null);

  // Name input (for guests)
  const [playerName, setPlayerName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  // room code from URL (if joining)
  const searchParams = new URLSearchParams(location.search);
  const urlRoomCode = searchParams.get("room");
  const isGuest = Boolean(urlRoomCode); // true = joined via link, false = host

  // Prefill name from localStorage (do NOT auto-join / hide popup)
  useEffect(() => {
    const savedName = localStorage.getItem("timeclash_player_name");
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  // On mount: host => create room, guest => fetch room.
  // NO players are created here.
  useEffect(() => {
    let unsub = null;
    let isMounted = true;

    async function init() {
      try {
        setLoading(true);
        setError(null);

        let roomData;

        if (isGuest) {
          // Guest: look up room by code (no auto-join)
          roomData = await getRoomByCode(urlRoomCode);
        } else {
          // Host: create a brand new room, starting with 0 players
          roomData = await createRoom();
          // update URL so host can copy/share the link
          navigate(`?room=${roomData.code}`, { replace: true });
        }

        if (!isMounted) return;

        setRoom(roomData);

        // Subscribe to players in this room (so host & guests see updates)
        unsub = subscribeToPlayers(roomData.id, (list) => {
          if (isMounted) setPlayers(list);
        });
      } catch (err) {
        console.error("Error initializing InviteLink:", err);
        if (isMounted) {
          setError(
            err?.message ||
              "Could not create / join room. Check Supabase tables & policies."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
      if (unsub) unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGuest, urlRoomCode]);

  // Invite URL to display / copy
  const inviteUrl =
    room && room.code
      ? `${window.location.origin}/multiplayer?room=${room.code}`
      : "";

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 1500);
    } catch (err) {
      console.error("Failed to copy link:", err);
      setCopyStatus("Copy failed");
      setTimeout(() => setCopyStatus(""), 1500);
    }
  };

  // Avatar colors
  const avatarColors = [
    "bg-purple-600",
    "bg-orange-500",
    "bg-blue-600",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-pink-500",
  ];

  // Guests: when they submit a name, actually join as a player
  const handleNameSubmit = async (e) => {
    e.preventDefault();
    const trimmed = playerName.trim();
    if (!trimmed || !room?.id) return;

    try {
      await joinRoom(room.id, trimmed); // join by room.id
      localStorage.setItem("timeclash_player_name", trimmed);
      setHasJoined(true); // hide popup AFTER successful join
    } catch (err) {
      console.error("Error joining room:", err);
      setError(err?.message || "Could not join room as player.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* --- TOP BAR --- */}
      <header className="w-full px-6 py-4 flex items-center bg-white shadow-sm">
        <div className="flex items-center gap-2 flex-1">
          <FiClock className="text-blue-600 text-2xl" />
          <span className="font-semibold text-lg">Time Clash</span>
          <FiChevronDown className="text-gray-600 text-xl cursor-pointer" />
        </div>

        <div className="flex-1 flex justify-center">
          <span className="text-sm font-semibold text-gray-700 tracking-wide">
            0:00
          </span>
        </div>

        <div className="flex items-center justify-end gap-4 flex-1 text-gray-600">
          <FiVolumeX className="cursor-pointer hover:text-gray-800" />
          <FiSettings className="cursor-pointer hover:text-gray-800" />
          <FiX className="cursor-pointer hover:text-gray-800" />
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 px-8 py-10 flex flex-col items-center">
        {/* Invite Link box */}
        <section className="w-full max-w-3xl flex flex-col items-center mb-12">
          <h2 className="text-lg font-semibold mb-4">Invite Link</h2>

          <div className="w-full bg-gray-100 rounded-xl px-6 py-4 flex items-center justify-between">
            <span className="text-blue-600 underline break-all text-sm sm:text-base">
              {loading
                ? "Generating invite link..."
                : error
                ? `Error: ${error}`
                : inviteUrl}
            </span>
            <button
              className="ml-4 p-2 rounded-full hover:bg-gray-200 text-gray-600 disabled:opacity-50"
              onClick={handleCopy}
              disabled={!inviteUrl || !!error}
            >
              <FiCopy className="text-lg" />
            </button>
          </div>

          {copyStatus && (
            <p className="mt-2 text-xs text-gray-500">{copyStatus}</p>
          )}
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </section>

        {/* Players row */}
        <section className="w-full max-w-3xl flex flex-col items-center mb-8">
          <h3 className="text-md font-semibold mb-4">Players</h3>

          {loading ? (
            <p className="text-sm text-gray-500">Loading players…</p>
          ) : error ? (
            <p className="text-sm text-red-500">
              Cannot load players because the room was not created.
            </p>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
              {players.length === 0 && (
                <p className="text-sm text-gray-400">
                  Waiting for players to join…
                </p>
              )}
              {players.map((p, idx) => (
                <div
                  key={p.id}
                  className={`w-10 h-10 rounded-full ${
                    avatarColors[idx % avatarColors.length]
                  } flex items-center justify-center text-white font-semibold`}
                  title={p.name}
                >
                  {p.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* --- BOTTOM BAR --- */}
      <footer className="w-full bg-white border-t mt-auto">
        <div className="max-w-4xl mx-auto py-4 flex justify-center">
          <Link
            to={
              room && room.code
                ? `/multiplayer-game?room=${room.code}`
                : "#"
            }
          >
            <button
              className="px-8 py-2 rounded-full bg-blue-600 text-white font-semibold text-sm shadow hover:bg-blue-700 disabled:opacity-50"
              disabled={!room || !room.code || !!error}
            >
              Start Game
            </button>
          </Link>
        </div>
      </footer>

      {/* --- NAME POPUP: ONLY FOR GUESTS WHO HAVEN'T JOINED YET --- */}
      {isGuest && !hasJoined && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white rounded-2xl shadow-lg px-6 py-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-3">
              Enter your name to join this game
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              The lobby starts with 0 players. Each person joins by entering
              their name.
            </p>
            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Sachi"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                disabled={!playerName.trim() || !room}
              >
                Join lobby
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
