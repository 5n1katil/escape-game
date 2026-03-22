"use client";

import {
  getCompletedGameResult,
  getPlayerKeyForSlug,
  getPlayerSession,
  setActiveAvatarUrl,
  setActiveMemberId,
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
    const memberIdFromQuery = searchParams.get("memberId");
    const avatarFromQuery =
      searchParams.get("avatarUrl") ?? searchParams.get("avatar") ?? null;
    console.log("INTRO memberId:", memberIdFromQuery);
    const stored = getStoredPlayerName(slug);
    if (fromQuery && fromQuery.trim().length > 0) {
      setStoredPlayerName(slug, normalizePlayerName(fromQuery));
    } else if (!stored) {
      // No query param and nothing stored: seed fallback.
      setStoredPlayerName(slug, "Dedektif");
    }
    setActiveMemberId(memberIdFromQuery);
    setActiveAvatarUrl(avatarFromQuery);
    console.log("[intro] active memberId persisted", { slug, memberId: memberIdFromQuery ?? null });

    const session = getPlayerSession(slug);
    const playerKey = getPlayerKeyForSlug(slug);
    const completedSnapshot = getCompletedGameResult(playerKey, slug);
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
      <div
        className="intro-ranking-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/82 px-3 py-6 backdrop-blur-md sm:px-6 sm:py-10 lg:backdrop-blur-xl"
        role="presentation"
      >
        <div
          className="intro-ranking-modal-pop relative w-full max-w-[min(96vw,52rem)] lg:max-w-[min(94vw,64rem)] xl:max-w-[72rem]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="intro-ranking-title"
        >
          {/* Dış amber parıltı */}
          <div
            className="pointer-events-none absolute -inset-1 rounded-[1.35rem] bg-gradient-to-br from-amber-400/35 via-amber-600/15 to-transparent opacity-90 blur-sm sm:-inset-2 sm:rounded-[1.75rem] lg:-inset-3"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[0_0_100px_rgba(245,158,11,0.22),0_0_180px_rgba(180,83,9,0.12)] sm:rounded-[1.75rem]" aria-hidden />

          <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/55 bg-gradient-to-b from-zinc-900/98 via-zinc-950/98 to-black/95 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(251,191,36,0.12)] ring-2 ring-amber-400/25 sm:p-10 md:p-12 lg:p-14 xl:p-16 sm:rounded-[1.75rem]">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(251,191,36,0.14),transparent_55%)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 border-amber-400/50 sm:left-6 sm:top-6 lg:left-8 lg:top-8"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 border-amber-400/50 sm:right-6 sm:top-6 lg:right-8 lg:top-8"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 border-amber-400/50 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 border-amber-400/50 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8"
              aria-hidden
            />

            <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center xl:max-w-5xl">
              <h3
                id="intro-ranking-title"
                className="text-balance text-2xl font-bold leading-tight tracking-tight text-amber-300 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                style={{
                  textShadow:
                    "0 0 40px rgba(245, 158, 11, 0.35), 0 2px 0 rgba(0,0,0,0.8)",
                }}
              >
                {t.intro.rankingModalTitle}
              </h3>
              <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-zinc-200 sm:mt-8 sm:text-lg md:text-xl md:leading-relaxed lg:mt-10 lg:text-2xl lg:leading-relaxed">
                {t.intro.rankingModalBody1}
              </p>
              <p className="mt-5 max-w-3xl text-pretty text-base leading-relaxed text-zinc-200 sm:mt-6 sm:text-lg md:text-xl md:leading-relaxed lg:text-2xl lg:leading-relaxed">
                {t.intro.rankingModalBody2}
              </p>
              <button
                type="button"
                onClick={() => setShowRankingModal(false)}
                className="ranking-modal-cta mt-8 min-h-[52px] w-full max-w-md touch-manipulation rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_32px_rgba(245,158,11,0.45),0_12px_28px_rgba(0,0,0,0.45)] ring-2 ring-amber-400/40 transition-all duration-300 hover:from-amber-400 hover:to-amber-500 hover:shadow-[0_0_48px_rgba(251,191,36,0.55),0_16px_36px_rgba(0,0,0,0.5)] hover:ring-amber-300/50 active:scale-[0.98] sm:mt-10 sm:min-h-[60px] sm:max-w-lg sm:py-5 sm:text-lg lg:mt-12 lg:min-h-[68px] lg:max-w-xl lg:text-xl"
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
