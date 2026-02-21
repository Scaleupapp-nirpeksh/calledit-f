import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <div>
        <h2 className="text-lg font-bold text-foreground">Page Not Found</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Home className="h-4 w-4" />
        Go Home
      </Link>
    </div>
  );
}
