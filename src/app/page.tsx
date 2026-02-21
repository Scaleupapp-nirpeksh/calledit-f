"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  Target,
  Trophy,
  Users,
  Brain,
  TrendingUp,
  Timer,
  Flame,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/lib/utils/storage";

const FEATURES = [
  {
    icon: Target,
    title: "Ball-by-Ball Predictions",
    description:
      "Predict every delivery — dot, single, boundary, six, or wicket. 15-second windows keep the adrenaline pumping.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "ML models show you probability charts for every ball. Make smarter predictions with real data.",
  },
  {
    icon: Flame,
    title: "Streak Multipliers",
    description:
      "Build streaks up to 3x points. Clutch predictions in death overs earn 2x. Stack them all for massive scores.",
  },
  {
    icon: Trophy,
    title: "Live Leaderboards",
    description:
      "Climb match, daily, and season leaderboards in real-time. See exactly where you rank after every ball.",
  },
  {
    icon: Users,
    title: "Private Leagues",
    description:
      "Create leagues with friends, share invite codes, and compete head-to-head across the entire IPL season.",
  },
  {
    icon: TrendingUp,
    title: "Win Probability",
    description:
      "Watch live win probability shift ball-by-ball with AI-generated commentary and over summaries.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Pick a Live Match",
    description: "Choose from ongoing IPL and T20 matches",
  },
  {
    step: "02",
    title: "Predict Each Ball",
    description: "You have 15 seconds before each delivery to call it",
  },
  {
    step: "03",
    title: "Earn Points & Climb",
    description: "Correct predictions earn points with streak multipliers",
  },
  {
    step: "04",
    title: "Win Bragging Rights",
    description: "Top the leaderboard and earn badges",
  },
];

const PREDICTION_TYPES = [
  {
    icon: Zap,
    label: "Ball",
    points: "10 pts",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Timer,
    label: "Over",
    points: "25 pts",
    color: "text-electric-blue",
    bg: "bg-electric-blue/10",
  },
  {
    icon: TrendingUp,
    label: "Milestone",
    points: "50 pts",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    icon: Trophy,
    label: "Winner",
    points: "100 pts",
    color: "text-chart-5",
    bg: "bg-chart-5/10",
  },
];

export default function LandingPage() {
  const router = useRouter();

  // If already logged in, skip to dashboard
  useEffect(() => {
    if (getAccessToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <span className="text-xl font-black tracking-tight text-primary">
            CalledIt
          </span>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Glow effects */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute top-20 right-0 h-60 w-[400px] rounded-full bg-secondary/15 blur-[100px]" />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 text-center sm:pt-28">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-3.5 w-3.5" />
            IPL 2026 is live
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Predict Every Ball.{" "}
            <span className="bg-gradient-to-r from-primary via-emerald-400 to-secondary bg-clip-text text-transparent">
              Own Every Moment.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
            Real-time cricket predictions with AI insights, streak multipliers,
            and live leaderboards. Prove you know the game better than anyone.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="h-14 px-8 text-base font-bold shadow-lg shadow-primary/25"
              >
                Start Predicting
                <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-base"
              >
                See How It Works
              </Button>
            </a>
          </div>

          {/* Prediction type pills */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
            {PREDICTION_TYPES.map(({ icon: Icon, label, points, color, bg }) => (
              <div
                key={label}
                className={`flex items-center gap-2 rounded-full border border-border/50 ${bg} px-4 py-2`}
              >
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="text-sm font-semibold">{label}</span>
                <span className="text-xs text-muted-foreground">{points}</span>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card/50 p-6 backdrop-blur">
            <div className="px-4 text-center">
              <div className="text-2xl font-black text-primary sm:text-3xl">
                15s
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Prediction Window
              </div>
            </div>
            <div className="px-4 text-center">
              <div className="text-2xl font-black text-secondary sm:text-3xl">
                7
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Ball Outcomes
              </div>
            </div>
            <div className="px-4 text-center">
              <div className="text-2xl font-black text-chart-3 sm:text-3xl">
                3x
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Max Streak Multiplier
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ball prediction mockup */}
      <section className="border-y border-border bg-card/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              What&apos;s the next ball going to be?
            </h2>
            <p className="mt-2 text-muted-foreground">
              7 outcomes. 15 seconds. Can you call it?
            </p>
          </div>

          {/* Mock prediction buttons */}
          <div className="mx-auto mt-10 max-w-md">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Over 16.3</span>
                <span className="font-mono text-primary">
                  15s remaining
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {[
                  { label: "Dot", color: "border-dot-ball text-dot-ball" },
                  { label: "1", color: "border-foreground/30 text-foreground" },
                  { label: "2", color: "border-foreground/30 text-foreground" },
                  { label: "3", color: "border-foreground/30 text-foreground" },
                  { label: "4", color: "border-boundary text-boundary" },
                  { label: "6", color: "border-six text-six" },
                  { label: "W", color: "border-wicket text-wicket" },
                ].map(({ label, color }) => (
                  <div
                    key={label}
                    className={`flex h-14 items-center justify-center rounded-xl border-2 ${color} bg-muted/50 text-lg font-bold transition-all hover:scale-105 hover:bg-muted cursor-pointer`}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  MI 149/3 (16.2)
                </span>
                <div className="flex items-center gap-1 text-xs text-primary">
                  <Flame className="h-3 w-3" />
                  <span>3 streak</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">How It Works</h2>
            <p className="mt-2 text-muted-foreground">
              Four steps to becoming a prediction master
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map(({ step, title, description }) => (
              <div
                key={step}
                className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:bg-card/80"
              >
                <div className="mb-4 text-4xl font-black text-primary/20 transition-colors group-hover:text-primary/40">
                  {step}
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="border-t border-border bg-card/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Everything You Need to Dominate
            </h2>
            <p className="mt-2 text-muted-foreground">
              Built for serious cricket fans who live every ball
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring breakdown */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Points That Stack
            </h2>
            <p className="mt-2 text-muted-foreground">
              Multipliers stack together — one clutch prediction can be worth 80
              points
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-lg space-y-3">
            {[
              { label: "Correct Ball", base: "10", mult: "", total: "10 pts" },
              {
                label: "+ Streak (5+)",
                base: "",
                mult: "2.0x",
                total: "20 pts",
              },
              {
                label: "+ Confidence Boost",
                base: "",
                mult: "2.0x",
                total: "40 pts",
              },
              {
                label: "+ Death Over Clutch",
                base: "",
                mult: "2.0x",
                total: "80 pts",
              },
            ].map(({ label, base, mult, total }, i) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </div>
                  <span className="font-medium">{label}</span>
                </div>
                <div className="flex items-center gap-3">
                  {base && (
                    <span className="text-sm text-muted-foreground">
                      {base}
                    </span>
                  )}
                  {mult && (
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-sm font-bold text-primary">
                      {mult}
                    </span>
                  )}
                  <span className="min-w-[60px] text-right font-mono font-bold">
                    {total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center">
          <h2 className="text-3xl font-black sm:text-4xl">
            Ready to Call It?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            Join thousands of cricket fans making real-time predictions. Free to
            play, impossible to put down.
          </p>
          <Link href="/login" className="mt-8 inline-block">
            <Button
              size="lg"
              className="h-14 px-10 text-base font-bold shadow-lg shadow-primary/25"
            >
              Get Started — It&apos;s Free
              <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          <span className="font-bold text-primary">CalledIt</span> &mdash;
          Cricket predictions, reimagined.
        </div>
      </footer>
    </div>
  );
}
