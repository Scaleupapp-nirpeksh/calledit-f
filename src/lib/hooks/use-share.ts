"use client";

import { useCallback } from "react";
import { toast } from "sonner";

interface ShareData {
  title: string;
  text: string;
  url: string;
}

/**
 * Hook that provides a share function using the Web Share API
 * with clipboard fallback for unsupported browsers.
 */
export function useShare() {
  const share = useCallback(async (data: ShareData) => {
    // Try native Web Share API first (mobile browsers)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (err) {
        // User cancelled — not an error
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    // Fallback: copy URL to clipboard
    try {
      await navigator.clipboard.writeText(data.url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to share");
    }
  }, []);

  const canNativeShare =
    typeof navigator !== "undefined" && !!navigator.share;

  return { share, canNativeShare };
}
