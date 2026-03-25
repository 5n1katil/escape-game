"use client";

import { useGameUi } from "@/components/GameVisualThemeProvider";
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
import { createPortal } from "react-dom";

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
  const { themeId, ui } = useGameUi();
  const im = ui.introModal;
  const rankingTitleShadow =
    themeId === "cyber"
      ? "0 0 40px rgba(34, 211, 238, 0.35), 0 2px 0 rgba(0,0,0,0.8)"
      : "0 0 40px rgba(245, 158, 11, 0.35), 0 2px 0 rgba(0,0,0,0.8)";
  const t = getTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasSession, setHasSession] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  function getRankingModalSeenKey() {
    const session = getPlayerSession(slug);
    const playerKey = getPlayerKeyForSlug(slug);
    const sessionMarker = session?.startedAt ?? "pre-session";
    return `introRankingModalSeen:${playerKey}:${slug}:${sessionMarker}`;
  }

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
    const modalSeenKey = getRankingModalSeenKey();
    const alreadySeenModal =
      typeof window !== "undefined" && localStorage.getItem(modalSeenKey) === "1";

    setHasSession(hasPlayerSession(slug));
    setIsCompleted(Boolean(completedSnapshot) || escapedState);
    setShowRankingModal(!alreadySeenModal);
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
    const modal = (
      <div
        className="intro-ranking-overlay fixed inset-0 z-[200] flex overflow-y-auto bg-black/82 px-3 py-6 backdrop-blur-md sm:items-center sm:justify-center sm:px-6 sm:py-10 lg:backdrop-blur-xl"
        role="presentation"
      >
        <div
          className="intro-ranking-modal-pop relative z-[201] my-auto max-h-[90dvh] w-full max-w-[min(96vw,52rem)] overflow-y-auto lg:max-w-[min(94vw,64rem)] xl:max-w-[72rem]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="intro-ranking-title"
        >
          <div className={im.outerGlow} aria-hidden />
          <div className={im.outerShadowGlow} aria-hidden />

          <div className={im.frame}>
            <div className={im.radialOverlay} aria-hidden />
            <div
              className={`pointer-events-none absolute left-4 top-4 h-6 w-6 border-l-2 border-t-2 sm:left-6 sm:top-6 lg:left-8 lg:top-8 ${im.corner}`}
              aria-hidden
            />
            <div
              className={`pointer-events-none absolute right-4 top-4 h-6 w-6 border-r-2 border-t-2 sm:right-6 sm:top-6 lg:right-8 lg:top-8 ${im.corner}`}
              aria-hidden
            />
            <div
              className={`pointer-events-none absolute bottom-4 left-4 h-6 w-6 border-b-2 border-l-2 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8 ${im.corner}`}
              aria-hidden
            />
            <div
              className={`pointer-events-none absolute bottom-4 right-4 h-6 w-6 border-b-2 border-r-2 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 ${im.corner}`}
              aria-hidden
            />

            <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center xl:max-w-5xl">
              <h3
                id="intro-ranking-title"
                className={im.modalTitle}
                style={{ textShadow: rankingTitleShadow }}
              >
                {t.intro.rankingModalTitle}
              </h3>
              <p className={im.modalBody}>
                {t.intro.rankingModalBody1}
              </p>
              <p className={im.modalBodySecond}>
                {t.intro.rankingModalBody2}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem(getRankingModalSeenKey(), "1");
                  }
                  setShowRankingModal(false);
                }}
                className={im.modalCta}
              >
                {t.intro.rankingModalCta}
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    if (typeof document === "undefined") return modal;
    return createPortal(modal, document.body);
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
              className={im.btnGhost}
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
            className={im.btnPrimary}
          >
            {t.intro.continueGame}
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className={im.btnGhost}
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
        className={im.startMain}
      >
        {t.intro.startGame}
      </button>
    </>
  );
}
