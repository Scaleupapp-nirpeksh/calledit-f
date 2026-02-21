import type { Metadata } from "next";

interface SharePageProps {
  params: Promise<{ shareId: string }>;
}

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const { shareId } = await params;
  return {
    title: `CalledIt — Shared Prediction`,
    description: "Check out this prediction on CalledIt!",
    openGraph: {
      title: "CalledIt — Cricket Predictions",
      description: "Predict ball-by-ball outcomes in live cricket matches.",
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://calledit.in"}/share/${shareId}`,
      siteName: "CalledIt",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "CalledIt — Cricket Predictions",
      description: "Predict ball-by-ball outcomes in live cricket matches.",
    },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { shareId } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Brand */}
        <div>
          <h1 className="text-3xl font-bold text-primary">CalledIt</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cricket Predictions
          </p>
        </div>

        {/* Share card placeholder */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Shared content: <span className="font-mono text-xs">{shareId}</span>
          </p>
          <p className="mt-3 text-sm">
            Download CalledIt to make your own predictions and compete with
            friends!
          </p>
        </div>

        {/* CTA */}
        <a
          href="/login"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Join CalledIt
        </a>
      </div>
    </main>
  );
}
