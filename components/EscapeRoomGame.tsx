"use client";

import { saveScore } from "@/lib/firebase";
import {
  addPenaltySeconds,
  clearGameState,
  getStoredAttempts,
  getStoredEscaped,
  getStoredMaxSolvedRoomIndex,
  getStoredPlayerName,
  normalizePlayerName,
  setStoredAttempts,
  setStoredEscaped,
  setStoredMaxSolvedRoomIndex,
} from "@/lib/gameStorage";
import { calculateScore, getSession } from "@/lib/gameSession";
import {
  isCorrectAnswer,
  isCorrectImageChoice,
  isCorrectMultipleChoice,
} from "@/lib/rooms";
import type { Room } from "@/data/rooms";
import type { Translations } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface EscapeRoomGameProps {
  slug: string;
  roomIndex: number;
  rooms: readonly Room[];
  t: Translations["room"];
  /** Label for "back to hub" button after solving a room */
  backToHubLabel?: string;
  /** Final escape code to show when last room is solved */
  finalCode?: string;
}

function getInitialAttempts(slug: string, roomId: number): number {
  if (typeof window === "undefined") return 0;
  const stored = getStoredAttempts(slug, roomId);
  return stored !== null ? stored : 0;
}

function getInitialEscaped(slug: string): boolean {
  if (typeof window === "undefined") return false;
  return getStoredEscaped(slug) === true;
}

export default function EscapeRoomGame({
  slug,
  roomIndex,
  rooms,
  t,
  backToHubLabel = "Ana Ekrana Dön",
  finalCode,
}: EscapeRoomGameProps) {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [escaped, setEscapedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; alt?: string } | null>(null);
  const scoreSavedRef = useRef(false);

  const currentRoom = rooms[roomIndex];
  const isLastRoom = roomIndex === rooms.length - 1;

  useEffect(() => {
    setAttempts(getInitialAttempts(slug, currentRoom.id));
    setEscapedState(getInitialEscaped(slug));
    setHydrated(true);
  }, [slug, currentRoom.id]);

  useEffect(() => {
    if (!hydrated) return;
    setStoredAttempts(slug, attempts, currentRoom.id);
  }, [hydrated, slug, attempts, currentRoom.id]);

  useEffect(() => {
    if (!hydrated) return;
    setStoredEscaped(slug, escaped);
  }, [hydrated, slug, escaped]);

  useEffect(() => {
    if (!lightboxImage) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxImage]);

  useEffect(() => {
    const session = getSession(slug);
    const scoreResult = session ? calculateScore(session) : null;

    console.log("[score-save] effect run", {
      escaped,
      hydrated,
      slug,
      hasSession: !!session,
      hasScoreResult: !!scoreResult,
    });

    if (!hydrated) {
      console.warn("[score-save] skipped: not hydrated");
      return;
    }
    if (!escaped) {
      console.warn("[score-save] skipped: not escaped");
      return;
    }
    if (scoreSavedRef.current) {
      console.warn("[score-save] skipped: already saved");
      return;
    }

    const playerName = normalizePlayerName(getStoredPlayerName(slug));
    const score = scoreResult?.finalScore ?? 0;
    const time = scoreResult?.remainingTime ?? 0;
    const mistakes = scoreResult?.totalAttempts ?? 0;

    if (!session) {
      console.warn("[score-save] skipped: no session (using fallback 0,0,0 for debug)");
    }
    if (!scoreResult) {
      console.warn("[score-save] no scoreResult (using fallback values for debug)");
    }

    scoreSavedRef.current = true;
    console.log("[score-save] attempting save", { playerName, score, time, mistakes });

    (async () => {
      try {
        await saveScore(playerName, slug, score, time, mistakes);
        console.log("[score-save] completed");
      } catch (e) {
        console.error("[score-save] error", e);
      }
    })();
  }, [escaped, slug, hydrated]);

  function markRoomSolved() {
    const roomIds = rooms.map((r) => r.id);
    const newMax = Math.max(
      getStoredMaxSolvedRoomIndex(slug, roomIds),
      roomIndex
    );
    setStoredMaxSolvedRoomIndex(slug, newMax, roomIds, attempts);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("escape-game-room-solved", { detail: { slug } })
      );
    }
    setShowSuccess(true);
    setError(null);
    setInputValue("");
  }

  function handleWrongAnswer() {
    const penaltyMinutes = currentRoom.id;
    addPenaltySeconds(slug, penaltyMinutes * 60);
    setAttempts((a) => a + 1);
    setInputValue("");
    setError(t.penaltyMessage.replace("{minutes}", String(penaltyMinutes)));
  }

  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (isCorrectAnswer(currentRoom, trimmed)) {
      markRoomSolved();
    } else {
      handleWrongAnswer();
    }
  }

  function handleMultipleChoiceSelect(index: number) {
    setError(null);
    if (isCorrectMultipleChoice(currentRoom, index)) {
      markRoomSolved();
    } else {
      handleWrongAnswer();
    }
  }

  function handleImageChoiceSelect(index: number) {
    setError(null);
    if (isCorrectImageChoice(currentRoom, index)) {
      markRoomSolved();
    } else {
      handleWrongAnswer();
    }
  }

  if (showSuccess) {
    return (
      <div className="mx-auto w-full max-w-xl space-y-6 rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-4 py-8 text-center sm:px-8 sm:py-10">
        <div className="flex justify-center">
          <span className="text-5xl" aria-hidden>✓</span>
        </div>
        <h2 className="text-2xl font-bold text-emerald-400 sm:text-3xl md:text-4xl">
          {t.roomSolved}
        </h2>
        <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
          {currentRoom.title} tamamlandı.
        </p>
        {isLastRoom && finalCode && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-950/30 px-4 py-3 text-left">
            <p className="text-sm font-semibold text-amber-400/90">
              {t.escapePasswordLabel}
            </p>
            <p className="mt-1 font-mono text-lg font-bold tracking-wide text-amber-200">
              {finalCode}
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              {t.escapePasswordHint}
            </p>
          </div>
        )}
        <p className="text-sm text-zinc-400">
          Hazır olduğunuzda aşağıdaki butonla ana ekrana dönüp diğer odalara geçebilirsiniz.
        </p>
        <button
          type="button"
          onClick={() => router.push(`/game/${slug}/hub`)}
          className="w-full min-h-[48px] touch-manipulation rounded-lg bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-emerald-500 active:scale-[0.98] sm:py-4 sm:text-lg"
        >
          {backToHubLabel}
        </button>
      </div>
    );
  }

  if (escaped) {
    const session = getSession(slug);
    const scoreResult = session ? calculateScore(session) : null;

    function formatTime(seconds: number): string {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s.toString().padStart(2, "0")}`;
    }

    return (
      <div className="mx-auto w-full max-w-xl space-y-6 rounded-lg border border-amber-500/30 bg-amber-950/20 px-4 py-8 text-center sm:px-8 sm:py-10">
        <h2 className="text-2xl font-bold text-amber-400 sm:text-3xl md:text-4xl">
          {t.escaped.title}
        </h2>
        <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
          {t.escaped.message}
        </p>
        {scoreResult && (
          <div
            className="space-y-3 rounded-lg border border-amber-500/20 bg-zinc-900/40 px-4 py-4 text-left"
            role="region"
            aria-label={t.result.title}
          >
            <h3 className="text-center text-lg font-semibold text-amber-300">
              {t.result.title}
            </h3>
            <dl className="grid gap-2 sm:grid-cols-2">
              <div className="flex justify-between gap-4 sm:flex-col sm:gap-0">
                <dt className="text-sm text-zinc-400">{t.result.finalScore}</dt>
                <dd className="text-lg font-bold text-white tabular-nums">
                  {scoreResult.finalScore}
                </dd>
              </div>
              <div className="flex justify-between gap-4 sm:flex-col sm:gap-0">
                <dt className="text-sm text-zinc-400">
                  {t.result.remainingTime}
                </dt>
                <dd className="text-lg font-medium text-zinc-200 tabular-nums">
                  {formatTime(scoreResult.remainingTime)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 sm:flex-col sm:gap-0">
                <dt className="text-sm text-zinc-400">
                  {t.result.totalAttempts}
                </dt>
                <dd className="text-lg font-medium text-zinc-200 tabular-nums">
                  {scoreResult.totalAttempts}
                </dd>
              </div>
              <div className="flex justify-between gap-4 sm:flex-col sm:gap-0">
                <dt className="text-sm text-zinc-400">
                  {t.result.firstTryCount}
                </dt>
                <dd className="text-lg font-medium text-zinc-200 tabular-nums">
                  {scoreResult.roomsSolvedFirstTry}
                </dd>
              </div>
            </dl>
          </div>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <button
            type="button"
            onClick={() => {
              clearGameState(slug);
              window.location.href = `/game/${slug}/intro`;
            }}
            className="inline-flex min-h-[48px] min-w-[160px] touch-manipulation items-center justify-center rounded-lg bg-amber-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-amber-500 active:scale-95"
          >
            {t.escaped.playAgain}
          </button>
        </div>
      </div>
    );
  }

  function renderPuzzle() {
    switch (currentRoom.type) {
      case "text":
        return (
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <div>
              <label htmlFor="puzzle-answer" className="sr-only">
                {t.answerLabel}
              </label>
              <input
                id="puzzle-answer"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t.answerPlaceholder}
                autoComplete="off"
                autoFocus
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-base text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 sm:py-3.5 sm:text-lg"
                aria-invalid={!!error}
                aria-describedby={error ? "error-message" : undefined}
              />
              {error && (
                <p
                  id="error-message"
                  role="alert"
                  className="mt-2 text-sm text-red-400"
                >
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-full min-h-[48px] touch-manipulation rounded-lg bg-amber-600 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] sm:py-4 sm:text-lg"
            >
              {t.submitAnswer}
            </button>
          </form>
        );

      case "multipleChoice": {
        const options = currentRoom.options ?? [];
        return (
          <div className="space-y-4">
            <div className="grid gap-2 sm:grid-cols-2">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleMultipleChoiceSelect(idx)}
                  className="min-h-[48px] touch-manipulation rounded-lg border-2 border-zinc-700 bg-zinc-800/50 px-4 py-3 text-left text-base font-medium text-zinc-200 transition-all hover:border-amber-500/50 hover:bg-zinc-800 active:scale-[0.98] sm:text-lg"
                >
                  {option}
                </button>
              ))}
            </div>
            {options.length === 0 && (
              <p className="text-sm text-zinc-500">
                {t.puzzlePlaceholders.multipleChoice} (seçenek yok)
              </p>
            )}
            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}
          </div>
        );
      }

      case "imageChoice": {
        const media = currentRoom.media ?? [];
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              {media.map((item, idx) => (
                <div
                  key={idx}
                  className="group flex min-h-[100px] flex-col overflow-hidden rounded-xl border-2 border-zinc-700 bg-zinc-800/50 transition-all hover:border-amber-500/50 hover:bg-zinc-800/70 sm:min-h-[120px]"
                >
                  <button
                    type="button"
                    onClick={() => item.url?.trim() && setLightboxImage({ url: item.url!, alt: item.alt })}
                    className="flex flex-1 flex-col items-center justify-center gap-2 p-4 cursor-zoom-in touch-manipulation text-left"
                    title={t.imageClickHint}
                  >
                    {item.url?.trim() ? (
                      <img
                        src={encodeURI(item.url)}
                        alt={item.alt ?? ""}
                        className="h-full max-h-32 w-full object-contain pointer-events-none"
                      />
                    ) : (
                      <span
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-950/50 text-3xl text-amber-400/80"
                        aria-hidden
                      >
                        {["◆", "◇", "●", "○"][idx % 4]}
                      </span>
                    )}
                    {item.alt && (
                      <span className="text-center text-sm font-medium text-zinc-200 group-hover:text-amber-100/90">
                        {item.alt}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleImageChoiceSelect(idx)}
                    className="min-h-[44px] w-full touch-manipulation border-t border-zinc-700 bg-zinc-800/80 px-4 py-2 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/20 active:scale-[0.98]"
                  >
                    {t.chooseThisOption}
                  </button>
                </div>
              ))}
            </div>
            {media.length === 0 && (
              <p className="text-sm text-zinc-500">
                {t.puzzlePlaceholders.imageChoice} (görsel yok)
              </p>
            )}
            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}
          </div>
        );
      }

      case "objectFind":
        return (
          <div className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800/50">
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-6xl">🗺️</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-4">
                <span className="rounded-full border-2 border-amber-500/60 bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-400">
                  Tıklanabilir nokta
                </span>
              </div>
            </div>
            <p className="text-center text-sm text-zinc-500">
              {t.puzzlePlaceholders.objectFind}
            </p>
          </div>
        );

      case "videoPuzzle":
        return (
          <div className="space-y-4">
            <div className="aspect-video overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800/50">
              <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                <span className="text-5xl">▶️</span>
                <span className="text-sm text-zinc-500">
                  Video oynatıcı
                </span>
              </div>
            </div>
            <p className="text-center text-sm text-zinc-500">
              {t.puzzlePlaceholders.videoPuzzle}
            </p>
          </div>
        );

      default:
        return (
          <div className="flex min-h-[120px] items-center justify-center rounded-lg border border-dashed border-zinc-600/50 bg-zinc-800/20 px-6 py-8">
            <p className="text-center text-sm font-medium text-zinc-500">
              Bilinmeyen bulmaca türü
            </p>
          </div>
        );
    }
  }

  const storyText = currentRoom.story ?? currentRoom.description;
  const puzzlePromptText = currentRoom.puzzlePrompt ?? currentRoom.question;

  const roomIds = rooms.map((r) => r.id);
  const maxSolvedIndex = getStoredMaxSolvedRoomIndex(slug, roomIds);
  const isRoomAlreadySolved = hydrated && roomIndex <= maxSolvedIndex;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-5 text-left sm:space-y-5 sm:px-6 sm:py-6 md:px-8 md:py-7">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            {currentRoom.title}
          </h2>
          <span
            className="text-sm tabular-nums text-zinc-500"
            aria-live="polite"
          >
            {t.attempts.replace("{count}", String(attempts))}
          </span>
        </div>
        {currentRoom.description && (
          <p className="text-sm text-amber-500/80">{currentRoom.description}</p>
        )}
      </div>

      {currentRoom.audioSrc && (
        <div className="flex items-center gap-3 rounded-lg border border-zinc-700/50 bg-zinc-800/30 px-4 py-3 sm:py-3.5">
          <span className="text-2xl shrink-0" aria-hidden>🔊</span>
          <audio
            controls
            src={encodeURI(currentRoom.audioSrc)}
            className="h-10 flex-1 min-w-0 max-w-full"
            preload="metadata"
          >
            {t.audioLabel}
          </audio>
        </div>
      )}

      {storyText && (
        <section aria-label={t.storyLabel}>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-500/90">
            {t.storyLabel}
          </h3>
          <p className="whitespace-pre-line text-base leading-relaxed text-zinc-300 sm:text-lg">
            {storyText}
          </p>
        </section>
      )}

      {currentRoom.storyImages && currentRoom.storyImages.length > 0 && (
        <section className="space-y-4" aria-label="Hikâye görselleri">
          <div
            className={
              currentRoom.id === 4 && currentRoom.storyImages.length === 2
                ? "grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-6"
                : currentRoom.id === 5 && currentRoom.storyImages.length === 2
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)] sm:gap-6"
                  : "grid grid-cols-1 gap-4 sm:grid-cols-2"
            }
          >
            {currentRoom.storyImages.map((img, idx) => {
              const rightFullScale = (currentRoom.id === 4 || currentRoom.id === 5) && idx === 1;
              const leftRoom5 = currentRoom.id === 5 && idx === 0;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLightboxImage({ url: img.url, alt: img.alt })}
                  className={
                    rightFullScale
                      ? "overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-800/30 flex min-w-0 cursor-zoom-in touch-manipulation text-left"
                      : leftRoom5
                        ? "flex min-h-[280px] overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-800/30 sm:min-h-[340px] cursor-zoom-in touch-manipulation text-left"
                        : "overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-800/30 cursor-zoom-in touch-manipulation text-left"
                  }
                  title={t.imageClickHint}
                >
                  <img
                    src={encodeURI(img.url)}
                    alt={img.alt ?? ""}
                    className={
                      rightFullScale
                        ? "h-auto w-full min-w-0 object-contain object-left pointer-events-none"
                        : leftRoom5
                          ? "h-auto w-full object-contain object-center pointer-events-none"
                          : "h-auto w-full object-contain pointer-events-none"
                    }
                  />
                </button>
              );
            })}
          </div>
        </section>
      )}

      {isRoomAlreadySolved ? (
        <section
          className="rounded-xl border border-amber-500/30 bg-amber-950/30 px-5 py-5 sm:px-6 sm:py-6"
          aria-label={t.roomSolved}
        >
          <p className="text-center text-lg font-semibold text-amber-400 sm:text-xl">
            {t.roomAlreadyCompleted}
          </p>
        </section>
      ) : (
        <section aria-label={t.puzzlePromptLabel}>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-500/90">
            {t.puzzlePromptLabel}
          </h3>
          <p className="mb-4 text-base leading-relaxed text-zinc-300 sm:text-lg">
            {puzzlePromptText}
          </p>
          {renderPuzzle()}
        </section>
      )}

      {/* Popup: tıklanınca görseli büyük göster */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.imageCloseLabel}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-white shadow-lg transition-colors hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label={t.imageCloseLabel}
          >
            <span className="text-xl leading-none" aria-hidden>×</span>
          </button>
          <div
            className="relative max-h-[90vh] max-w-[95vw] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={encodeURI(lightboxImage.url)}
              alt={lightboxImage.alt ?? ""}
              className="max-h-[85vh] w-auto max-w-full object-contain"
              draggable={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
