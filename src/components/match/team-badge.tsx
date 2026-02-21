"use client";

import Image from "next/image";
import { getTeamColors } from "@/lib/utils/team";
import { cn } from "@/lib/utils";

interface TeamBadgeProps {
  code: string;
  imgUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

const IMG_SIZES = {
  sm: 24,
  md: 32,
  lg: 40,
};

export function TeamBadge({
  code,
  imgUrl,
  size = "md",
  className,
}: TeamBadgeProps) {
  const colors = getTeamColors(code);

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg border font-bold overflow-hidden",
        colors.bg,
        colors.border,
        imgUrl ? "p-0.5" : colors.text,
        SIZES[size],
        className
      )}
    >
      {imgUrl ? (
        <Image
          src={imgUrl}
          alt={code}
          width={IMG_SIZES[size]}
          height={IMG_SIZES[size]}
          className="h-full w-full rounded object-contain"
          unoptimized
        />
      ) : (
        code
      )}
    </span>
  );
}
