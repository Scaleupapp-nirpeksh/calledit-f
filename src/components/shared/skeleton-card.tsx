"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/** Animated skeleton pulse block */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
    />
  );
}

/** Skeleton shaped like a match card */
export function MatchCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-6 w-8" />
        <div className="flex items-center gap-3">
          <div className="space-y-2 text-right">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
      <Skeleton className="mt-3 h-3 w-full" />
    </div>
  );
}

/** Skeleton for leaderboard rows */
export function LeaderboardRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="h-5 w-5" />
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-4 w-12" />
    </div>
  );
}

/** Skeleton for stats grid */
export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-3 text-center"
        >
          <Skeleton className="mx-auto mb-1.5 h-4 w-4" />
          <Skeleton className="mx-auto h-5 w-12" />
          <Skeleton className="mx-auto mt-1 h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton for profile header */
export function ProfileHeaderSkeleton() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}
