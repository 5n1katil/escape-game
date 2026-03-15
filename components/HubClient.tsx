"use client";

import CountdownTimer from "@/components/CountdownTimer";
import RestartButton from "@/components/RestartButton";
import type { Room } from "@/data/rooms";
import { getSession } from "@/lib/gameSession";
import { getStoredMaxSolvedRoomIndex } from "@/lib/gameStorage";
import { isCorrectFinalCode } from "@/lib/rooms";
import type { Translations } from "@/lib/i18n";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { setStoredEscaped } from "@/lib/gameStorage";

const MAP_IMAGE_PATH = "/games/tapinagin-laneti/map.png";

interface HubClientProps {
  slug: string;
  gameTitle: string;
  story: string;
  rooms: readonly Room[];
  finalCode: string | undefined;
  t: Translations["hub"];
  timerAriaLabel: string;
  durationMinutes: number;
}

export default function HubClient({
  slug,
  gameTitle,
  story,
  rooms,
  finalCode,
  t,
  timerAriaLabel,
  durationMinutes,
}: HubClientProps) {
  const router = useRouter();
  const [unlockedIds, setUnlockedIds] = useState<number[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const [finalInput, setFinalInput] = useState("");
  const [finalError, setFinalError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mapError, setMapError] = useState(false);

  const roomIds = rooms.map((r) => r.id);

  const refreshSession = useCallback(() => {
    const session = getSession(slug);
    if (session) {
      setUnlockedIds(session.unlockedRoomIds ?? []);
      setSolvedCount(session.solvedRoomIds?.length ?? 0);
    }
  }, [slug]);

  useEffect(() => {
    refreshSession();
    setMounted(true);
  }, [refreshSession]);

  useEffect(() => {
    function onSolved() {
      refreshSession();
    }
    window.addEventListener("escape-game-room-solved", onSolved as EventListener);
    return () => window.removeEventListener("escape-game-room-solved", onSolved as EventListener);
  }, [refreshSession]);

  const allSolved = mounted && solvedCount >= 6;
  const showFinalCode = allSolved && finalCode;

  function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFinalError(null);
    const trimmed = finalInput.trim();
    if (!trimmed || !finalCode) return;
    if (isCorrectFinalCode(finalCode, trimmed)) {
      setStoredEscaped(slug, true);
      router.push(`/game/${slug}/result`);
    } else {
      setFinalError(t.finalCodeWrong);
    }
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-950/80"
        aria-hidden
      />
      <main className="relative z-10 flex min-h-screen flex-col gap-6 px-4 py-20 pb-24 sm:gap-8 sm:px-6 sm:py-16 md:flex-row md:items-start md:justify-center md:gap-8 md:pt-24 lg:gap-10 lg:px-8">
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between sm:left-6 sm:right-6 sm:top-6">
          <Link
            href={`/game/${slug}/intro`}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-sm text-zinc-500 transition-colors hover:text-amber-500 sm:px-2"
          >
            {t.backToIntro}
          </Link>
          <RestartButton slug={slug} label="Oyunu Yeniden Başlat" />
        </div>

        <div className="flex w-full flex-1 flex-col items-center gap-6 pt-12 sm:gap-8 md:max-w-2xl md:pt-16">
          <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-lg sm:text-2xl md:text-3xl lg:text-4xl">
            {gameTitle}
          </h1>
          <CountdownTimer
            slug={slug}
            initialMinutes={durationMinutes}
            ariaLabelTemplate={timerAriaLabel}
          />

          <section className="w-full rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-4 sm:px-6 sm:py-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-500/90">
              {t.story}
            </h2>
            <div className="whitespace-pre-line text-base leading-relaxed text-zinc-300 sm:text-lg">
              {story}
            </div>
          </section>

          <section className="w-full rounded-lg border border-zinc-800/50 bg-zinc-900/40 overflow-hidden">
            <h2 className="border-b border-zinc-700/50 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-amber-500/90">
              {t.map}
            </h2>
            <div className="relative flex min-h-[180px] items-center justify-center bg-zinc-900/50 p-4">
              {!mapError ? (
                <img
                  src={MAP_IMAGE_PATH}
                  alt="Tapınak haritası"
                  className="max-h-[200px] w-auto object-contain"
                  onError={() => setMapError(true)}
                />
              ) : (
                <div className="flex min-h-[120px] items-center justify-center text-5xl text-zinc-600" aria-hidden>
                  🗺️
                </div>
              )}
            </div>
          </section>

          <section className="w-full rounded-lg border border-zinc-800/50 bg-zinc-900/40 px-4 py-4 sm:px-6 sm:py-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-500/90">
              {t.rooms}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {rooms.map((room) => {
                const unlocked = unlockedIds.includes(room.id);
                const maxSolved = getStoredMaxSolvedRoomIndex(slug, roomIds);
                const roomIndex = rooms.findIndex((r) => r.id === room.id);
                const solved = roomIndex >= 0 && roomIndex <= maxSolved;
                return (
                  <div key={room.id}>
                    {unlocked ? (
                      <Link
                        href={`/game/${slug}/room/${room.id}`}
                        className="flex items-center gap-3 rounded-lg border-2 border-zinc-700 bg-zinc-800/50 px-4 py-3 transition-colors hover:border-amber-500/60 hover:bg-zinc-800"
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${
                            solved ? "bg-emerald-900/50 text-emerald-400" : "bg-amber-900/30 text-amber-400"
                          }`}
                        >
                          {solved ? "✓" : room.id}
                        </span>
                        <span className="font-medium text-zinc-200">{room.title}</span>
                        <span className="ml-auto text-sm text-amber-500/80">{t.goToRoom}</span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 rounded-lg border-2 border-zinc-700/50 bg-zinc-800/30 px-4 py-3 opacity-60">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-500">
                          🔒
                        </span>
                        <span className="font-medium text-zinc-500">{room.title}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {showFinalCode && (
            <section className="w-full rounded-lg border border-amber-700/40 bg-amber-950/30 px-4 py-5 sm:px-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-400">
                {t.allRoomsSolved}
              </h2>
              <form onSubmit={handleFinalSubmit} className="space-y-3">
                <div>
                  <label htmlFor="final-code" className="sr-only">
                    {t.finalCodeLabel}
                  </label>
                  <input
                    id="final-code"
                    type="text"
                    value={finalInput}
                    onChange={(e) => setFinalInput(e.target.value)}
                    placeholder={t.finalCodePlaceholder}
                    autoComplete="off"
                    className="w-full rounded-lg border border-amber-700/50 bg-zinc-900/80 px-4 py-3 text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  {finalError && (
                    <p className="mt-2 text-sm text-red-400" role="alert">
                      {finalError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!finalInput.trim()}
                  className="w-full rounded-lg bg-amber-600 py-3 text-lg font-semibold text-white transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t.finalCodeSubmit}
                </button>
              </form>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
