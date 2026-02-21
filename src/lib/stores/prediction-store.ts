"use client";

import { create } from "zustand";

type PredictionState = "idle" | "window_open" | "submitted" | "resolved";

interface PredictionResult {
  predictionId: string;
  isCorrect: boolean;
  points: number;
  actualOutcome: string;
  timestamp: number;
}

interface PredictionStoreState {
  // Current state
  state: PredictionState;
  submittedBallKey: string | null;
  selectedOutcome: string | null;
  confidenceBoost: boolean;

  // Match-level tracking
  boostsUsed: number;
  boostsRemaining: number;
  currentStreak: number;
  totalPoints: number;

  // Recent results for toast/animations
  lastResult: PredictionResult | null;

  // Actions
  openWindow: () => void;
  selectOutcome: (outcome: string) => void;
  toggleConfidenceBoost: () => void;
  markSubmitted: (ballKey: string) => void;
  resolveResult: (result: PredictionResult) => void;
  closeWindow: () => void;
  syncSummary: (summary: {
    boostsUsed: number;
    boostsRemaining: number;
    currentStreak: number;
    totalPoints: number;
  }) => void;
  reset: () => void;
}

export const usePredictionStore = create<PredictionStoreState>((set) => ({
  state: "idle",
  submittedBallKey: null,
  selectedOutcome: null,
  confidenceBoost: false,
  boostsUsed: 0,
  boostsRemaining: 3,
  currentStreak: 0,
  totalPoints: 0,
  lastResult: null,

  openWindow: () =>
    set({
      state: "window_open",
      selectedOutcome: null,
      confidenceBoost: false,
      submittedBallKey: null,
    }),

  selectOutcome: (outcome) => set({ selectedOutcome: outcome }),

  toggleConfidenceBoost: () =>
    set((s) => ({
      confidenceBoost: !s.confidenceBoost && s.boostsRemaining > 0,
    })),

  markSubmitted: (ballKey) =>
    set({ state: "submitted", submittedBallKey: ballKey }),

  resolveResult: (result) =>
    set((s) => ({
      state: "resolved",
      lastResult: result,
      currentStreak: result.isCorrect ? s.currentStreak + 1 : 0,
      totalPoints: s.totalPoints + result.points,
    })),

  closeWindow: () =>
    set({
      state: "idle",
      selectedOutcome: null,
      confidenceBoost: false,
      submittedBallKey: null,
    }),

  syncSummary: (summary) =>
    set({
      boostsUsed: summary.boostsUsed,
      boostsRemaining: summary.boostsRemaining,
      currentStreak: summary.currentStreak,
      totalPoints: summary.totalPoints,
    }),

  reset: () =>
    set({
      state: "idle",
      submittedBallKey: null,
      selectedOutcome: null,
      confidenceBoost: false,
      boostsUsed: 0,
      boostsRemaining: 3,
      currentStreak: 0,
      totalPoints: 0,
      lastResult: null,
    }),
}));
