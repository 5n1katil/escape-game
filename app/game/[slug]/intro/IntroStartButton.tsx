"use client";

import {
  clearSession,
  createSession,
  getSession,
} from "@/lib/gameSession";
import { getTranslations } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IntroStartButtonProps {
  slug: string;
  durationSeconds: number;
  firstRoomId?: number;
}

export default function IntroStartButton({
  slug,
  durationSeconds,
  firstRoomId = 1,
}: IntroStartButtonProps) {
  const t = getTranslations();
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHasSession(getSession(slug) !== null);
    setMounted(true);
  }, [slug]);

  function handleStart() {
    createSession(slug, durationSeconds, firstRoomId);
    router.push(`/game/${slug}/room/${firstRoomId}`);
  }

  function handleContinue() {
    const session = getSession(slug);
    if (!session) return;
    router.push(`/game/${slug}/room/${session.currentRoomId}`);
  }

  function handleRestart() {
    clearSession(slug);
    createSession(slug, durationSeconds, firstRoomId);
    router.push(`/game/${slug}/room/${firstRoomId}`);
  }

  if (!mounted) {
    return (
      <div className="h-14 w-full animate-pulse rounded-lg bg-zinc-800/50" />
    );
  }

  if (hasSession) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <button
          type="button"
          onClick={handleContinue}
          className="flex-1 min-h-[56px] touch-manipulation rounded-xl bg-amber-600 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-amber-900/30 transition-all hover:bg-amber-500 hover:shadow-amber-500/25 active:scale-[0.98] sm:min-h-[64px] sm:text-xl"
        >
          {t.intro.continueGame}
        </button>
        <button
          type="button"
          onClick={handleRestart}
          className="flex-1 min-h-[56px] touch-manipulation rounded-xl border-2 border-amber-700/60 bg-transparent px-6 py-4 text-lg font-semibold text-amber-100/90 transition-colors hover:border-amber-600/80 hover:bg-amber-900/20 active:scale-[0.98] sm:min-h-[64px] sm:text-xl"
        >
          {t.intro.restartFromIntro}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleStart}
      className="w-full min-h-[64px] touch-manipulation rounded-xl bg-amber-600 px-8 py-5 text-xl font-bold text-white shadow-lg shadow-amber-900/40 transition-all hover:bg-amber-500 hover:shadow-amber-500/30 active:scale-[0.98] sm:min-h-[72px] sm:text-2xl"
    >
      {t.intro.startGame}
    </button>
  );
}
