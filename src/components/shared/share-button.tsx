"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShare } from "@/lib/hooks/use-share";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function ShareButton({
  title,
  text,
  url,
  variant = "ghost",
  size = "icon",
  className,
}: ShareButtonProps) {
  const { share } = useShare();

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => share({ title, text, url })}
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
}
