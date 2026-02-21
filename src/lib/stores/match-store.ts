"use client";

import { create } from "zustand";
import type { Match, BallLogEntry } from "@/lib/types/match";
import type { MatchStatus } from "@/lib/types/constants";
import type {
  BallUpdatePayload,
  ScoreUpdatePayload,
  PredictionWindowPayload,
  AiCommentaryPayload,
  OverSummaryPayload,
} from "@/lib/socket/events";

interface CommentaryEntry {
  ball_key: string;
  text: string;
  timestamp: number;
}

interface PredictionWindow {
  isOpen: boolean;
  ballKey: string;
  innings: number;
  over: number;
  ball: number;
  closesAt: string;
}

interface MatchStoreState {
  // Current match being viewed
  match: Match | null;
  ballLog: BallLogEntry[];
  commentary: CommentaryEntry[];
  predictionWindow: PredictionWindow | null;

  // Actions
  setMatch: (match: Match) => void;
  clearMatch: () => void;
  applyBallUpdate: (payload: BallUpdatePayload) => void;
  applyScoreUpdate: (payload: ScoreUpdatePayload) => void;
  applyStatusChange: (matchId: string, status: MatchStatus) => void;
  setPredictionWindow: (payload: PredictionWindowPayload) => void;
  addCommentary: (payload: AiCommentaryPayload) => void;
  addOverSummary: (payload: OverSummaryPayload) => void;
}

export const useMatchStore = create<MatchStoreState>((set, get) => ({
  match: null,
  ballLog: [],
  commentary: [],
  predictionWindow: null,

  setMatch: (match) => {
    set({ match, ballLog: [], commentary: [], predictionWindow: null });
  },

  clearMatch: () => {
    set({ match: null, ballLog: [], commentary: [], predictionWindow: null });
  },

  applyBallUpdate: (payload) => {
    const { match } = get();
    if (!match || match.id !== payload.match_id) return;

    const newBall: BallLogEntry = {
      ball_key: payload.ball_key,
      innings: payload.innings,
      over: payload.over,
      ball: payload.ball,
      batter: payload.batter,
      bowler: payload.bowler,
      non_striker: "",
      outcome: payload.outcome,
      batter_runs: payload.batter_runs,
      extras: payload.extras,
      total_runs: payload.total_runs,
      is_wicket: payload.is_wicket,
      wicket_kind: null,
      player_out: null,
    };

    // Update the innings score in the match object
    const updatedInnings = match.innings.map((inn) => {
      if (inn.innings_number === payload.innings) {
        return {
          ...inn,
          score: payload.score,
          wickets: payload.wickets,
          overs: payload.overs,
          run_rate: payload.run_rate,
        };
      }
      return inn;
    });

    set({
      match: {
        ...match,
        innings: updatedInnings,
        current_innings: payload.innings,
        current_over: payload.over,
        current_ball: payload.ball,
      },
      ballLog: [...get().ballLog, newBall],
    });
  },

  applyScoreUpdate: (payload) => {
    const { match } = get();
    if (!match || match.id !== payload.match_id) return;

    const updatedInnings = match.innings.map((inn) => {
      if (inn.innings_number === payload.innings) {
        return {
          ...inn,
          score: payload.score,
          wickets: payload.wickets,
          overs: payload.overs,
          run_rate: payload.run_rate,
        };
      }
      return inn;
    });

    set({ match: { ...match, innings: updatedInnings } });
  },

  applyStatusChange: (matchId, status) => {
    const { match } = get();
    if (!match || match.id !== matchId) return;
    set({ match: { ...match, status } });
  },

  setPredictionWindow: (payload) => {
    const { match } = get();
    if (!match || match.id !== payload.match_id) return;

    if (!payload.is_open) {
      set({ predictionWindow: null });
      return;
    }

    set({
      predictionWindow: {
        isOpen: true,
        ballKey: payload.ball_key,
        innings: payload.innings,
        over: payload.over,
        ball: payload.ball,
        closesAt: payload.closes_at,
      },
    });
  },

  addCommentary: (payload) => {
    const { match } = get();
    if (!match || match.id !== payload.match_id) return;

    set({
      commentary: [
        ...get().commentary,
        {
          ball_key: payload.ball_key,
          text: payload.commentary,
          timestamp: Date.now(),
        },
      ],
    });
  },

  addOverSummary: (payload) => {
    const { match } = get();
    if (!match || match.id !== payload.match_id) return;

    set({
      commentary: [
        ...get().commentary,
        {
          ball_key: `summary_${payload.innings}.${payload.over}`,
          text: payload.summary,
          timestamp: Date.now(),
        },
      ],
    });
  },
}));
