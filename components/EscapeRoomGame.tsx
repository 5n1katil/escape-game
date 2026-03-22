"use client";

import { useGameUi } from "@/components/GameVisualThemeProvider";
import {
  addPenaltySeconds,
  clearGameState,
  getActivePlayerKey,
  getCompletedGameResult,
  getStoredAttempts,
  getStoredEscaped,
  getStoredMaxSolvedRoomIndex,
  setStoredAttempts,
  setStoredEscaped,
  setStoredMaxSolvedRoomIndex,
} from "@/lib/gameStorage";
import {
  isCorrectAnswer,
  isCorrectImageChoice,
  isCorrectMultipleChoice,
} from "@/lib/rooms";
import MatrixPuzzle from "@/components/puzzles/MatrixPuzzle";
import NeuralFlowPuzzle from "@/components/puzzles/NeuralFlowPuzzle";
import SliderPuzzle from "@/components/puzzles/SliderPuzzle";
import TerminalPuzzle from "@/components/puzzles/TerminalPuzzle";
import type { Room } from "@/data/rooms";
import type { Translations } from "@/lib/i18n";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function EscapePasswordBox({
  code,
  label,
  hint,
  copyLabel,
  copiedLabel,
  copyAriaLabel,
}: {
  code: string;
  label: string;
  hint: string;
  copyLabel: string;
  copiedLabel: string;
  copyAriaLabel: string;
}) {
  const { ui } = useGameUi();
  const er = ui.escapeRoom;
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = code;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        /* ignore */
      }
    }
    setCopied(true);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={er.codeBox}>
      <p className={er.codeLabel}>{label}</p>
      <div className="mt-2 flex min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className={er.codeValue}>
          {code}
        </p>
        <button
          type="button"
          onClick={() => void handleCopy()}
          aria-label={copyAriaLabel}
          className={er.copyBtn}
        >
          {copied ? (
            <span className={er.copyBtnLabel}>
              {copiedLabel}
            </span>
          ) : (
            <>
              <CopyIcon className="h-4 w-4 shrink-0 opacity-90" />
              <span>{copyLabel}</span>
            </>
          )}
        </button>
      </div>
      <p className="mt-2 text-sm text-zinc-400">{hint}</p>
    </div>
  );
}

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
  const { ui } = useGameUi();
  const er = ui.escapeRoom;
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [escaped, setEscapedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; alt?: string } | null>(null);

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
      <div className="mx-auto w-full max-w-3xl space-y-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-4 py-8 text-center sm:px-8 sm:py-10 lg:max-w-none">
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
          <EscapePasswordBox
            code={finalCode}
            label={t.escapePasswordLabel}
            hint={t.escapePasswordHint}
            copyLabel={t.copyEscapeCode}
            copiedLabel={t.escapeCodeCopied}
            copyAriaLabel={t.copyEscapeCodeAria}
          />
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
    const playerKey = getActivePlayerKey();
    const finalResult = playerKey ? getCompletedGameResult(playerKey, slug) : null;

    function formatTime(seconds: number): string {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s.toString().padStart(2, "0")}`;
    }

    return (
      <div className={er.winWrap}>
        <h2 className={er.winTitle}>
          {t.escaped.title}
        </h2>
        <p className="text-base leading-8 text-slate-200 sm:text-lg">
          {t.escaped.message}
        </p>
        {finalResult && (
          <div
            className={er.winCard}
            role="region"
            aria-label={t.result.title}
          >
            <h3 className={er.winCardTitle}>
              {t.result.title}
            </h3>
            <dl className="grid gap-2 sm:grid-cols-2">
              <div className="flex justify-between gap-4 sm:flex-col sm:gap-0">
                <dt className="text-sm text-zinc-400">{t.result.finalScore}</dt>
                <dd className="text-lg font-bold text-white tabular-nums">
                  {finalResult.score}
                </dd>
              </div>
              <div className="flex justify-between gap-4 sm:flex-col sm:gap-0">
                <dt className="text-sm text-zinc-400">
                  {t.result.remainingTime}
                </dt>
                <dd className="text-lg font-medium text-zinc-200 tabular-nums">
                  {formatTime(finalResult.remainingTime)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 sm:flex-col sm:gap-0">
                <dt className="text-sm text-zinc-400">
                  {t.result.totalAttempts}
                </dt>
                <dd className="text-lg font-medium text-zinc-200 tabular-nums">
                  {finalResult.mistakes}
                </dd>
              </div>
              <div className="flex justify-between gap-4 sm:flex-col sm:gap-0">
                <dt className="text-sm text-zinc-400">
                  {t.result.firstTryCount}
                </dt>
                <dd className="text-lg font-medium text-zinc-200 tabular-nums">
                  {finalResult.roomsSolvedFirstTry}
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
            className={er.winCta}
          >
            {t.escaped.playAgain}
          </button>
        </div>
      </div>
    );
  }

  function renderPuzzle() {
    const pt = currentRoom.puzzleType;

    if (pt === "terminal") {
      return (
        <div className="space-y-4">
          <TerminalPuzzle
            onSolve={() => {
              setError(null);
              markRoomSolved();
            }}
            onWrong={handleWrongAnswer}
          />
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
      );
    }

    if (pt === "slider") {
      return (
        <div className="space-y-4">
          <SliderPuzzle
            onSolve={() => {
              setError(null);
              markRoomSolved();
            }}
            onWrong={handleWrongAnswer}
          />
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
      );
    }

    if (pt === "matrix") {
      return (
        <div className="space-y-4">
          <MatrixPuzzle
            onSolve={() => {
              setError(null);
              markRoomSolved();
            }}
          />
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
      );
    }

    if (pt === "neural-flow") {
      return (
        <div className="space-y-4">
          <NeuralFlowPuzzle
            onSolve={() => {
              setError(null);
              markRoomSolved();
            }}
            onWrong={handleWrongAnswer}
          />
          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
      );
    }

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
                className={er.textInput}
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
              className={er.primaryBtn}
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
                  className={er.choiceBtn}
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
                  className={er.imageChoiceCard}
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
                        className={er.imageChoiceIcon}
                        aria-hidden
                      >
                        {["◆", "◇", "●", "○"][idx % 4]}
                      </span>
                    )}
                    {item.alt && (
                      <span className={er.imageChoiceCaption}>
                        {item.alt}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleImageChoiceSelect(idx)}
                    className={er.imageChoiceSelect}
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
                <span className={er.attemptBadge}>
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
    <div className="w-full min-w-0 space-y-5 text-left sm:space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h2 className="text-balance text-lg font-semibold text-white sm:text-xl lg:text-2xl">
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
          <p className={er.descMuted}>{currentRoom.description}</p>
        )}
      </div>

      {currentRoom.audioSrc && (
        <div className="flex w-full min-w-0 items-center gap-3 rounded-xl border border-zinc-700/50 bg-zinc-800/30 px-4 py-3 sm:py-3.5">
          <span className="text-2xl shrink-0" aria-hidden>🔊</span>
          <audio
            controls
            src={encodeURI(currentRoom.audioSrc)}
            className="h-10 min-h-[40px] w-full min-w-0 max-w-full flex-1 rounded-md border border-zinc-600/50 bg-zinc-900/60"
            preload="metadata"
          >
            {t.audioLabel}
          </audio>
        </div>
      )}

      {storyText && (
        <section aria-label={t.storyLabel} className="min-w-0">
          <h3 className={`mb-3 ${er.storyHeading}`}>
            {t.storyLabel}
          </h3>
          <p className="whitespace-pre-line text-base leading-8 text-slate-200 lg:text-lg">
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
          className={er.puzzlePanel}
          aria-label={t.roomSolved}
        >
          <p className={er.puzzlePrompt}>
            {t.roomAlreadyCompleted}
          </p>
          {isLastRoom && finalCode && (
            <div className="mt-4">
              <EscapePasswordBox
                code={finalCode}
                label={t.escapePasswordLabel}
                hint={t.escapePasswordHint}
                copyLabel={t.copyEscapeCode}
                copiedLabel={t.escapeCodeCopied}
                copyAriaLabel={t.copyEscapeCodeAria}
              />
            </div>
          )}
        </section>
      ) : (
        <section aria-label={t.puzzlePromptLabel} className="min-w-0">
          <h3 className={`mb-3 ${er.storyHeading}`}>
            {t.puzzlePromptLabel}
          </h3>
          <p className="mb-5 text-base leading-8 text-slate-200 sm:mb-6 lg:text-lg">
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
            className={er.lightboxClose}
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
