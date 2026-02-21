"use client";

import { useEffect, useRef } from "react";
import { usePredictionStore } from "@/lib/stores/prediction-store";
import { useNotificationStore } from "@/lib/stores/notification-store";
import { toast } from "sonner";

/**
 * Listens for prediction result notifications and shows
 * animated toasts. Mount once in match detail page.
 */
export function PredictionResultListener() {
  const lastResult = usePredictionStore((s) => s.lastResult);
  const lastNotification = useNotificationStore((s) => {
    const notifs = s.notifications;
    return notifs.length > 0 ? notifs[notifs.length - 1] : null;
  });
  const shownRef = useRef<Set<string>>(new Set());

  // Show toast for prediction results from notification store
  useEffect(() => {
    if (!lastNotification) return;
    if (lastNotification.type !== "prediction_result") return;

    const id = JSON.stringify(lastNotification.data);
    if (shownRef.current.has(id)) return;
    shownRef.current.add(id);

    const isCorrect = lastNotification.data?.is_correct;
    const points = lastNotification.data?.points;

    if (isCorrect) {
      toast.success(lastNotification.title, {
        description: `${lastNotification.body}`,
        icon: "🎯",
      });
    } else {
      toast(lastNotification.title, {
        description: lastNotification.body,
        icon: "❌",
      });
    }

    // Sync to prediction store
    if (lastNotification.data?.prediction_id) {
      usePredictionStore.getState().resolveResult({
        predictionId: lastNotification.data.prediction_id as string,
        isCorrect: !!isCorrect,
        points: (points as number) ?? 0,
        actualOutcome: "",
        timestamp: Date.now(),
      });
    }
  }, [lastNotification]);

  // Show streak notifications
  useEffect(() => {
    if (!lastNotification) return;
    if (lastNotification.type !== "streak") return;

    const id = `streak_${lastNotification.data?.streak_count}`;
    if (shownRef.current.has(id)) return;
    shownRef.current.add(id);

    toast.success(lastNotification.title, {
      description: lastNotification.body,
      icon: "🔥",
    });
  }, [lastNotification]);

  // Sync the last result from the store directly (for local state updates)
  useEffect(() => {
    if (!lastResult) return;
    const id = lastResult.predictionId;
    if (shownRef.current.has(id)) return;
    shownRef.current.add(id);

    // Already handled by notification listener above
  }, [lastResult]);

  return null;
}
