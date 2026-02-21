"use client";

import { create } from "zustand";
import type { NotificationPayload } from "@/lib/socket/events";

interface NotificationStoreState {
  notifications: NotificationPayload[];
  addNotification: (notification: NotificationPayload) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStoreState>((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    // Keep last 50 notifications
    const existing = get().notifications;
    set({ notifications: [...existing.slice(-49), notification] });
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
