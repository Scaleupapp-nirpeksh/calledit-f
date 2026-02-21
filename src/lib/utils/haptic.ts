/**
 * Haptic feedback utility for mobile browsers.
 * Uses the Vibration API when available, silently no-ops otherwise.
 */

type HapticStyle = "light" | "medium" | "heavy" | "success" | "error";

const PATTERNS: Record<HapticStyle, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 20],
  error: [30, 50, 30, 50, 30],
};

export function haptic(style: HapticStyle = "light") {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  try {
    navigator.vibrate(PATTERNS[style]);
  } catch {
    // Silently fail — not all browsers support vibration
  }
}
