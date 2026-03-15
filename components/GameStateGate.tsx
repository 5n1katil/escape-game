"use client";

import { getTranslations } from "@/lib/i18n";
import { clearGameState, getStoredRemainingTime } from "@/lib/gameStorage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MAIN_PAGE_URL = "https://www.5n1dedektif.com/";

interface GameStateGateProps {
  slug: string;
  children: React.ReactNode;
}

/**
 * Redirects to intro if game state was never initialized (user skipped intro).
 * When the 1h timer runs out, shows game-over popup (lanet, Tekrar Oyna, Çıkış Yap).
 */
export default function GameStateGate({ slug, children }: GameStateGateProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const t = getTranslations().gameOver;

  useEffect(() => {
    const remaining = getStoredRemainingTime(slug);
    if (remaining === null) {
      router.replace(`/game/${slug}/intro`);
      return;
    }
    if (remaining <= 0) {
      setTimeUp(true);
      setReady(true);
      return;
    }
    setReady(true);
  }, [slug, router]);

  useEffect(() => {
    if (!ready || timeUp) return;
    const interval = setInterval(() => {
      const remaining = getStoredRemainingTime(slug);
      if (remaining !== null && remaining <= 0) {
        setTimeUp(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [slug, ready, timeUp]);

  const handlePlayAgain = () => {
    clearGameState(slug);
    router.push(`/game/${slug}/intro`);
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (timeUp) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="game-over-title"
          className="w-full max-w-md rounded-2xl border border-amber-700/50 bg-zinc-900 px-6 py-8 shadow-xl sm:px-8 sm:py-10"
        >
          <h2
            id="game-over-title"
            className="text-center text-xl font-bold text-amber-400 sm:text-2xl"
          >
            {t.message}
          </h2>
          <p className="mt-3 text-center text-sm text-zinc-400 sm:text-base">
            {t.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <button
              type="button"
              onClick={handlePlayAgain}
              className="min-h-[48px] rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-500 active:scale-[0.98]"
            >
              {t.playAgain}
            </button>
            <Link
              href={MAIN_PAGE_URL}
              className="min-h-[48px] flex items-center justify-center rounded-xl border border-zinc-600 bg-zinc-800 px-6 py-3 font-semibold text-zinc-200 transition-colors hover:bg-zinc-700 active:scale-[0.98]"
            >
              {t.exit}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
