"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function TopBar({ title, showBack = false, rightAction }: TopBarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 items-center gap-3 px-4">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="flex-1 truncate text-lg font-bold">{title}</h1>
        {rightAction}
      </div>
    </header>
  );
}
