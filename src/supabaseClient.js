// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// -------- Local player name --------
export function getOrCreateLocalPlayerName() {
  const key = "timeclash_player_name";
  let name = localStorage.getItem(key);

  if (!name) {
    const random = Math.floor(Math.random() * 1000);
    name = `player_${random}`;
    localStorage.setItem(key, name);
  }

  return name;
}

// -------- Room / player helpers --------

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// Host creates a room and joins it
export async function createRoomAndJoin() {
  const playerName = getOrCreateLocalPlayerName();
  const code = generateRoomCode();

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .insert({ code })
    .select()
    .single();

  if (roomError || !room) {
    console.error("Error creating room:", roomError);
    throw roomError || new Error("Failed to create room");
  }

  const { data: player, error: playerError } = await supabase
    .from("players")
    .insert({ room_id: room.id, name: playerName })
    .select()
    .single();

  if (playerError || !player) {
    console.error("Error joining as host:", playerError);
    throw playerError || new Error("Failed to join room");
  }

  return { room, player };
}

// Friend joins an existing room by its code
export async function joinRoomByCode(code) {
  const playerName = getOrCreateLocalPlayerName();

  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code)
    .single();

  if (roomError || !room) {
    console.error("Error loading room by code:", roomError);
    throw roomError || new Error("Room not found");
  }

  const { data: player, error: playerError } = await supabase
    .from("players")
    .insert({ room_id: room.id, name: playerName })
    .select()
    .single();

  if (playerError || !player) {
    console.error("Error joining room:", playerError);
    throw playerError || new Error("Failed to join room");
  }

  return { room, player };
}

// Subscribe to the live list of players in a room
export function subscribeToPlayers(roomId, onChange) {
  async function fetchPlayers() {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("room_id", roomId)
      .order("joined_at", { ascending: true });

    if (error) {
      console.error("Error fetching players:", error);
      return;
    }
    onChange(data || []);
  }

  // initial load
  fetchPlayers();

  const channel = supabase
    .channel(`room:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "players",
        filter: `room_id=eq.${roomId}`,
      },
      () => {
        fetchPlayers();
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
