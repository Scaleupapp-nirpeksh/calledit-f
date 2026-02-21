"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { useJoinLeague } from "@/lib/queries/leagues";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function JoinLeaguePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const mutation = useJoinLeague();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    mutation.mutate(
      { invite_code: code.trim().toUpperCase() },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          router.push(`/leagues/${data.league.id}`);
        },
        onError: (err) => {
          const message =
            (err as { response?: { data?: { detail?: string } } }).response
              ?.data?.detail ?? "Invalid invite code";
          toast.error(message);
        },
      }
    );
  };

  return (
    <>
      <TopBar title="Join League" showBack />

      <main className="mx-auto max-w-md p-4">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
            <UserPlus className="h-7 w-7 text-secondary" />
          </div>
          <h2 className="text-lg font-bold">Join a League</h2>
          <p className="mt-1 text-sm text-muted-foreground text-center">
            Enter the invite code shared by the league creator
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Invite Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABC12XYZ"
              maxLength={10}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-center font-mono text-lg tracking-widest outline-none focus:border-secondary"
            />
          </div>

          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={code.trim().length < 4 || mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Join League
          </Button>
        </form>
      </main>
    </>
  );
}
