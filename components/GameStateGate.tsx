"use client";

import { getStoredRemainingTime } from "@/lib/gameStorage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface GameStateGateProps {
  slug: string;
  children: React.ReactNode;
}

/**
 * Redirects to intro if game state was never initialized (user skipped intro).
 * Ensures timer only starts after "Oyuna Başla" is clicked.
 */
export default function GameStateGate({ slug, children }: GameStateGateProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const remaining = getStoredRemainingTime(slug);
    if (remaining === null) {
      router.replace(`/game/${slug}/intro`);
      return;
    }
    setReady(true);
  }, [slug, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
