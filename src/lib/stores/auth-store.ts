"use client";

import { create } from "zustand";
import type { User } from "@/lib/types/user";
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "@/lib/utils/storage";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (accessToken, refreshToken) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    set({ isAuthenticated: true });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  hydrate: () => {
    const token = getAccessToken();
    if (token) {
      set({ isAuthenticated: true, isLoading: false });
    } else {
      set({ isAuthenticated: false, isLoading: false });
    }
  },
}));
