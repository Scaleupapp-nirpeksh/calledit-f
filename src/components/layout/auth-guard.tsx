"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getMe } from "@/lib/api/users";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, setUser, logout, hydrate } =
    useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // Validate token + fetch user profile
    if (!user) {
      getMe()
        .then((userData) => {
          setUser(userData);
          if (!userData.is_onboarded) {
            router.replace("/onboarding");
          }
        })
        .catch(() => {
          logout();
          router.replace("/login");
        });
    }
  }, [isAuthenticated, isLoading, user, router, setUser, logout]);

  if (isLoading || (isAuthenticated && !user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
