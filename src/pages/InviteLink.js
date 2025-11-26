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
  createRoomAndJoin,
  joinRoomByCode,
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

  // Read room code from the URL (?room=ABC123)
  const searchParams = new URLSearchParams(location.search);
  const urlRoomCode = searchParams.get("room");

  useEffect(() => {
    let unsubscribe = null;
    let isMounted = true;

    async function init() {
      try {
        setLoading(true);
        setError(null);

        let roomData;

        if (urlRoomCode) {
          // Joining an existing room
          const { room } = await joinRoomByCode(urlRoomCode);
          roomData = room;
        } else {
          // Creating a new room as host
          const { room } = await createRoomAndJoin();
          roomData = room;

          // Update URL to include ?room=CODE so you can share it
          navigate(`?room=${roomData.code}`, { replace: true });
        }

        if (!isMounted) return;

        setRoom(roomData);

        // Set up realtime subscription to players in this room
        unsubscribe = subscribeToPlayers(roomData.id, (playersList) => {
          if (isMounted) setPlayers(playersList);
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
      if (unsubscribe) unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlRoomCode]);

  // Build invite URL for copy/share
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

  // Simple color cycle for avatars
  const avatarColors = [
    "bg-purple-600",
    "bg-orange-500",
    "bg-blue-600",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-pink-500",
  ];

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

        {/* Center: timer */}
        <div className="flex-1 flex justify-center">
          <span className="text-sm font-semibold text-gray-700 tracking-wide">
            0:00
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
      <main className="flex-1 px-8 py-10 flex flex-col items-center">
        {/* Invite Link box */}
        <section className="w-full max-w-3xl flex flex-col items-center mb-12">
          <h2 className="text-lg font-semibold mb-4">Invite Link</h2>

          <div className="w-full bg-gray-100 rounded-xl px-6 py-4 flex items-center justify-between">
            <span className="text-blue-600 underline break-all text-sm sm:text-base">
              {loading
                ? "Generating invite link..."
                : error
                ? "Error generating link (open DevTools console)."
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
          {error && (
            <p className="mt-2 text-xs text-red-500">
              {error}
            </p>
          )}
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
                  {p.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* --- BOTTOM BAR --- */}
      <footer className="w-full bg-white border-t mt-auto">
        <div className="max-w-4xl mx-auto py-4 flex justify-center">
          {/* Only allow starting once room is created */}
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
    </div>
  );
}
