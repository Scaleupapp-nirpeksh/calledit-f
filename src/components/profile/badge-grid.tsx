"use client";

import type { BadgeId } from "@/lib/types/constants";
import { BADGE_IDS } from "@/lib/types/constants";
import { BADGE_META } from "@/lib/utils/badges";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Flame,
  Zap,
  Target,
  Crown,
  Share2,
  Handshake,
  Calendar,
  Medal,
  Star,
} from "lucide-react";

interface BadgeGridProps {
  earned: BadgeId[];
  showAll?: boolean;
}

const BADGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: Trophy,
  fire: Flame,
  lightning: Zap,
  "100": Zap,
  target: Target,
  crystal_ball: Star,
  crown: Crown,
  share: Share2,
  handshake: Handshake,
  calendar: Calendar,
  medal: Medal,
  star: Star,
};

export function BadgeGrid({ earned, showAll = false }: BadgeGridProps) {
  const badges = showAll ? [...BADGE_IDS] : earned;

  if (badges.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No badges earned yet</p>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {badges.map((badgeId) => {
        const meta = BADGE_META[badgeId];
        const isEarned = earned.includes(badgeId);
        const Icon = BADGE_ICONS[meta.icon] ?? Star;

        return (
          <div
            key={badgeId}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all",
              isEarned
                ? "border-primary/20 bg-primary/5"
                : "border-border opacity-40"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                isEarned ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-semibold leading-tight">
              {meta.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
