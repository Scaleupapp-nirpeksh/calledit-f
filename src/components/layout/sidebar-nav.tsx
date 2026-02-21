"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Users, Medal, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/leaderboards", label: "Leaderboards", icon: Trophy },
  { href: "/leagues", label: "Leagues", icon: Users },
  { href: "/competitions", label: "Competitions", icon: Medal },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-55 flex-col border-r border-border bg-card/50">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
          <Zap className="h-4.5 w-4.5 text-primary" />
        </div>
        <span className="text-lg font-bold tracking-tight">
          Called<span className="text-primary">It</span>
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border px-4 py-3">
        <p className="text-[10px] text-muted-foreground/50 text-center">
          CalledIt v1.0
        </p>
      </div>
    </aside>
  );
}
