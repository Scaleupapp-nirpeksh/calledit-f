"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { useCurrentUser, useUpdateProfile } from "@/lib/queries/users";
import { IPL_TEAMS } from "@/lib/types/constants";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const mutation = useUpdateProfile();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [favouriteTeam, setFavouriteTeam] = useState("");
  const [favouritePlayers, setFavouritePlayers] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setDisplayName(user.display_name);
      setFavouriteTeam(user.favourite_team ?? "");
      setFavouritePlayers(user.favourite_players.join(", "));
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <>
        <TopBar title="Edit Profile" showBack />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const players = favouritePlayers
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    mutation.mutate(
      {
        username: username.trim(),
        display_name: displayName.trim(),
        favourite_team: favouriteTeam || undefined,
        favourite_players: players.length > 0 ? players : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated!");
          router.push("/profile");
        },
        onError: (err) => {
          const message =
            (err as { response?: { data?: { detail?: string } } }).response
              ?.data?.detail ?? "Failed to update profile";
          toast.error(message);
        },
      }
    );
  };

  return (
    <>
      <TopBar title="Edit Profile" showBack />

      <main className="mx-auto max-w-md p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Favourite Team
            </label>
            <select
              value={favouriteTeam}
              onChange={(e) => setFavouriteTeam(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="">None</option>
              {Object.entries(IPL_TEAMS).map(([code, name]) => (
                <option key={code} value={code}>
                  {name} ({code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Favourite Players
            </label>
            <input
              type="text"
              value={favouritePlayers}
              onChange={(e) => setFavouritePlayers(e.target.value)}
              placeholder="MS Dhoni, Virat Kohli"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Comma-separated names
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              !username.trim() || !displayName.trim() || mutation.isPending
            }
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </form>
      </main>
    </>
  );
}
