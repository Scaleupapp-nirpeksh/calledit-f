"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { getSocket, disconnectSocket, type AppSocket } from "./client";
import { useMatchStore } from "@/lib/stores/match-store";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getMatch } from "@/lib/api/matches";
import { normalizeMatch } from "@/lib/utils/normalize-match";
import type { RawMatch } from "@/lib/types/match";

/**
 * Manages the singleton socket lifecycle.
 * Connects when authenticated, disconnects on logout.
 * Mount this once in app providers.
 */
export function useSocket() {
  const socketRef = useRef<AppSocket | null>(null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      socketRef.current = null;
      return;
    }

    const socket = getSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[socket] connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("[socket] connection error:", err.message);
    });

    return () => {
      // Don't disconnect on unmount — socket is a singleton managed by auth state.
      // Only disconnect when user logs out (handled above).
    };
  }, [isAuthenticated]);

  return socketRef;
}

/**
 * Join a match room and wire all server events to the match store.
 * On unmount, leaves the room and clears store state.
 * On reconnect, re-joins the room and fetches latest state via REST.
 */
export function useMatchRoom(matchId: string | null) {
  const socketRef = useRef<AppSocket | null>(null);
  const store = useMatchStore();

  useEffect(() => {
    if (!matchId) return;

    const socket = getSocket();
    socketRef.current = socket;

    // Join room
    socket.emit("join_match", { match_id: matchId });

    // Full match state (received on join) — normalize raw API shape
    const onMatchState = (data: RawMatch) => {
      store.setMatch(normalizeMatch(data));
    };

    // Ball-by-ball updates
    const onBallUpdate = store.applyBallUpdate;

    // Score changes
    const onScoreUpdate = store.applyScoreUpdate;

    // Match status transitions
    const onMatchStatus = (data: { match_id: string; status: import("@/lib/types/constants").MatchStatus }) => {
      store.applyStatusChange(data.match_id, data.status);
    };

    // Prediction window open/close
    const onPredictionWindow = store.setPredictionWindow;

    // AI commentary
    const onAiCommentary = store.addCommentary;

    // Over summary
    const onOverSummary = store.addOverSummary;

    socket.on("match_state", onMatchState);
    socket.on("ball_update", onBallUpdate);
    socket.on("score_update", onScoreUpdate);
    socket.on("match_status", onMatchStatus);
    socket.on("prediction_window", onPredictionWindow);
    socket.on("ai_commentary", onAiCommentary);
    socket.on("over_summary", onOverSummary);

    // Reconnection recovery: re-join room + fetch latest state
    const onReconnect = async () => {
      socket.emit("join_match", { match_id: matchId });
      try {
        const freshMatch = await getMatch(matchId);
        store.setMatch(freshMatch);
      } catch {
        // Silently fail — socket will provide match_state on join
      }
    };

    socket.io.on("reconnect", onReconnect);

    return () => {
      socket.emit("leave_match", { match_id: matchId });
      socket.off("match_state", onMatchState);
      socket.off("ball_update", onBallUpdate);
      socket.off("score_update", onScoreUpdate);
      socket.off("match_status", onMatchStatus);
      socket.off("prediction_window", onPredictionWindow);
      socket.off("ai_commentary", onAiCommentary);
      socket.off("over_summary", onOverSummary);
      socket.io.off("reconnect", onReconnect);
      store.clearMatch();
    };
  }, [matchId]); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Countdown hook driven by `closes_at` timestamp from prediction window.
 * Uses requestAnimationFrame for smooth updates.
 * Returns seconds remaining (0 when expired).
 */
export function usePredictionCountdown(): number {
  const predictionWindow = useMatchStore((s) => s.predictionWindow);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const rafRef = useRef<number>(0);

  const tick = useCallback(() => {
    if (!predictionWindow?.closesAt) {
      setSecondsLeft(0);
      return;
    }

    const remaining = Math.max(
      0,
      (new Date(predictionWindow.closesAt).getTime() - Date.now()) / 1000
    );
    setSecondsLeft(remaining);

    if (remaining > 0) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [predictionWindow?.closesAt]);

  useEffect(() => {
    if (!predictionWindow?.isOpen) {
      setSecondsLeft(0);
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [predictionWindow?.isOpen, tick]);

  return secondsLeft;
}
