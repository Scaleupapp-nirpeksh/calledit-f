"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { completeOnboarding } from "@/lib/api/users";
import { useAuthStore } from "@/lib/stores/auth-store";
import { IPL_TEAMS, type TeamCode } from "@/lib/types/constants";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [favouriteTeam, setFavouriteTeam] = useState<TeamCode | "">("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!username.trim() || !displayName.trim()) {
      toast.error("Username and display name are required");
      return;
    }

    setLoading(true);
    try {
      const user = await completeOnboarding({
        username: username.trim(),
        display_name: displayName.trim(),
        favourite_team: favouriteTeam || undefined,
        referral_code_used: referralCode.trim() || undefined,
      });
      setUser(user);
      toast.success("Welcome to CalledIt!");
      router.push("/dashboard");
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        (err as { response?: { status?: number } }).response?.status === 409
      ) {
        toast.error("Username already taken. Try a different one.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 text-2xl font-black tracking-tight text-primary">
          CalledIt
        </div>
        <CardTitle className="text-xl">Set up your profile</CardTitle>
        <CardDescription>
          Choose a username and pick your favourite team
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              placeholder="cricket_fan_123"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))
              }
              className="bg-muted"
              maxLength={30}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              placeholder="John Doe"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-muted"
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label>Favourite Team</Label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(IPL_TEAMS) as TeamCode[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() =>
                    setFavouriteTeam(favouriteTeam === code ? "" : code)
                  }
                  className={cn(
                    "relative flex h-12 items-center justify-center rounded-lg border text-xs font-bold transition-all",
                    favouriteTeam === code
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {code}
                  {favouriteTeam === code && (
                    <Check className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-primary p-0.5 text-primary-foreground" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referral">Referral Code (optional)</Label>
            <Input
              id="referral"
              placeholder="FRIEND7A3B"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              className="bg-muted"
              maxLength={20}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Let&apos;s Go!
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
