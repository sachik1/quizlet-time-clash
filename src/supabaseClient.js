// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pmankcjxxjafojxreicx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYW5rY2p4eGphZm9qeHJlaWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMDEyMTQsImV4cCI6MjA3OTY3NzIxNH0.vbsnTDfpZTBrgBwmRsHNvdZvuggScVwjwYrtErwJavk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Optional helper – you can still use this if you want.
 */
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

/**
 * Create an empty room (no players yet).
 * Table: rooms (id uuid/int, code text)
 */
export async function createRoom() {
  // 6-char room code like "GVJW56"
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data, error } = await supabase
    .from("rooms")
    .insert({ code })
    .select("*")
    .single();

  if (error) {
    console.error("createRoom error:", error);
    throw error;
  }

  return data; // { id, code, ... }
}

/**
 * Get room by code (used by guests joining via link)
 */
export async function getRoomByCode(code) {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (error) {
    console.error("getRoomByCode error:", error);
    throw error;
  }

  if (!data) {
    throw new Error("Room not found");
  }

  return data;
}

/**
 * Join an existing room as a player with a given name.
 * Table: players (id, room_id, name)
 */
export async function joinRoom(roomId, playerName) {
  const { data, error } = await supabase
    .from("players")
    .insert({
      room_id: roomId,
      name: playerName,
    })
    // NOTE: no created_at here, since the column doesn't exist
    .select("id, room_id, name")
    .single();

  if (error) {
    console.error("joinRoom error:", error);
    throw error;
  }

  return data;
}

/**
 * Convenience wrapper: join by room code if you ever need it.
 */
export async function joinRoomByCode(roomCode, playerName) {
  const room = await getRoomByCode(roomCode);
  return joinRoom(room.id, playerName);
}

/**
 * Subscribe to players in a room for realtime lobby updates.
 */
export function subscribeToPlayers(roomId, callback) {
  let active = true;

  async function fetchPlayers() {
    const { data, error } = await supabase
      .from("players")
      // NOTE: no created_at here either
      .select("id, name")
      .eq("room_id", roomId)
      .order("id", { ascending: true }); // order by id instead of created_at

    if (error) {
      console.error("fetchPlayers error:", error);
      return;
    }
    if (active) {
      callback(data || []);
    }
  }

  // initial load
  fetchPlayers();

  // realtime subscription
  const channel = supabase
    .channel(`players-room-${roomId}`)
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

  // cleanup function
  return () => {
    active = false;
    supabase.removeChannel(channel);
  };
}
