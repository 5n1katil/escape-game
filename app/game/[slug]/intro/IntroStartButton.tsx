"use client";

import {
  getActivePlayerKey,
  getCompletedGameResult,
  getPlayerSession,
  getStoredEscaped,
  hasPlayerSession,
  restartPlayerSession,
  startNewPlayerSession,
} from "@/lib/gameStorage";
import {
  getStoredPlayerName,
  normalizePlayerName,
  setStoredPlayerName,
} from "@/lib/gameStorage";
import { getTranslations } from "@/lib/i18n";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const [hasSession, setHasSession] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fromQuery = searchParams.get("player");
    const stored = getStoredPlayerName(slug);
    if (fromQuery && fromQuery.trim().length > 0) {
      setStoredPlayerName(slug, normalizePlayerName(fromQuery));
    } else if (!stored) {
      // No query param and nothing stored: seed fallback.
      setStoredPlayerName(slug, "Dedektif");
    }

    const session = getPlayerSession(slug);
    const playerKey = getActivePlayerKey();
    const completedSnapshot = playerKey ? getCompletedGameResult(playerKey, slug) : null;
    const escapedState = getStoredEscaped(slug) === true || session?.escaped === true;

    setHasSession(hasPlayerSession(slug));
    setIsCompleted(Boolean(completedSnapshot) || escapedState);
    setMounted(true);
  }, [slug, searchParams]);

  /** Session and 60min timer start only here — not on intro page load. Then go to hub. */
  function handleStart() {
    startNewPlayerSession(slug, durationSeconds, firstRoomId);
    router.push(`/game/${slug}/hub`);
  }

  function handleContinue() {
    if (!hasPlayerSession(slug)) return;
    router.push(`/game/${slug}/hub`);
  }

  function handleRestart() {
    restartPlayerSession(slug, durationSeconds, firstRoomId);
    router.push(`/game/${slug}/hub`);
  }

  function renderRankingModal() {
    if (!showRankingModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 backdrop-blur-[2px]">
        <div className="w-full max-w-2xl rounded-2xl border border-amber-500/40 bg-gradient-to-br from-zinc-900/95 to-zinc-950/95 p-4 shadow-[0_0_45px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/20 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-amber-300">{t.intro.rankingModalTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{t.intro.rankingModalBody1}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">{t.intro.rankingModalBody2}</p>
            </div>
            <div className="sm:w-[220px] sm:flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowRankingModal(false)}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-amber-600 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-amber-900/35 transition-all hover:bg-amber-500 hover:shadow-amber-500/30 active:scale-[0.98]"
              >
                {t.intro.rankingModalCta}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="h-14 w-full animate-pulse rounded-lg bg-zinc-800/50" />
    );
  }

  if (hasSession) {
    if (isCompleted) {
      return (
        <>
          {renderRankingModal()}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={handleRestart}
              className="flex-1 min-h-[56px] touch-manipulation rounded-xl border-2 border-amber-700/60 bg-transparent px-6 py-4 text-lg font-semibold text-amber-100/90 transition-colors hover:border-amber-600/80 hover:bg-amber-900/20 active:scale-[0.98] sm:min-h-[64px] sm:text-xl"
            >
              {t.intro.restartFromIntro}
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        {renderRankingModal()}
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
      </>
    );
  }

  return (
    <>
      {renderRankingModal()}
      <button
        type="button"
        onClick={handleStart}
        className="w-full min-h-[64px] touch-manipulation rounded-xl bg-amber-600 px-8 py-5 text-xl font-bold text-white shadow-lg shadow-amber-900/40 transition-all hover:bg-amber-500 hover:shadow-amber-500/30 active:scale-[0.98] sm:min-h-[72px] sm:text-2xl"
      >
        {t.intro.startGame}
      </button>
    </>
  );
}
