"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/lib/stores/notification-store";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const notifications = useNotificationStore((s) => s.notifications);
  const clearNotifications = useNotificationStore((s) => s.clearNotifications);
  const [open, setOpen] = useState(false);
  const [lastSeenCount, setLastSeenCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = Math.max(0, notifications.length - lastSeenCount);

  // Close panel on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleOpen = () => {
    setOpen(!open);
    if (!open) {
      setLastSeenCount(notifications.length);
    }
  };

  const ICONS: Record<string, string> = {
    prediction_result: "🎯",
    streak: "🔥",
    badge: "🏅",
    league: "👥",
    match_start: "🏏",
    match_end: "🏁",
    leaderboard: "📊",
  };

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-8 w-8"
        onClick={handleOpen}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  clearNotifications();
                  setLastSeenCount(0);
                }}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y divide-border">
              {[...notifications].reverse().map((n, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex gap-3 px-4 py-3 text-sm",
                    idx < unreadCount && "bg-primary/5"
                  )}
                >
                  <span className="mt-0.5 text-base">
                    {ICONS[n.type] ?? "📢"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
