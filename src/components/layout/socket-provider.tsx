"use client";

import { useEffect } from "react";
import { useSocket } from "@/lib/socket/hooks";
import { useNotificationStore } from "@/lib/stores/notification-store";
import { toast } from "sonner";
import type { NotificationPayload } from "@/lib/socket/events";

/**
 * Manages the global socket connection and wires user-level events
 * (notifications). Mount once inside app providers.
 */
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useSocket();

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onNotification = (data: NotificationPayload) => {
      useNotificationStore.getState().addNotification(data);

      // Show toast based on type
      if (data.type === "prediction_result") {
        const isCorrect = (data.data as { is_correct?: boolean }).is_correct;
        const points = (data.data as { points?: number }).points;
        if (isCorrect) {
          toast.success(data.title, {
            description: `+${points} points`,
          });
        } else {
          toast.error(data.title, {
            description: data.body,
          });
        }
      } else if (data.type === "badge") {
        toast.success(data.title, { description: data.body });
      } else if (data.type === "streak") {
        toast.success(data.title, { description: data.body });
      } else {
        toast(data.title, { description: data.body });
      }
    };

    socket.on("notification", onNotification);
    return () => {
      socket.off("notification", onNotification);
    };
  }, [socketRef]);

  return <>{children}</>;
}
