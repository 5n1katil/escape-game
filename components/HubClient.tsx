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

const MAP_IMAGE_PATH = "/games/tapinagin-laneti/images/map.png";

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

  const mapContent = !mapError ? (
    <div className="relative h-full min-h-[200px] w-full md:min-h-[400px]">
      <img
        src={MAP_IMAGE_PATH}
        alt="Tapınak haritası - odalara tıklayarak gidebilirsiniz"
        className="h-full w-full object-contain"
        onError={() => setMapError(true)}
      />
      <div
        className="absolute inset-0 grid grid-cols-3 grid-rows-2"
        aria-hidden
      >
        {[1, 2, 3, 4, 5, 6].map((roomId) => {
          const room = rooms.find((r) => r.id === roomId);
          const unlocked = unlockedIds.includes(roomId);
          const maxSolved = getStoredMaxSolvedRoomIndex(slug, roomIds);
          const roomIndex = rooms.findIndex((r) => r.id === roomId);
          const solved = roomIndex >= 0 && roomIndex <= maxSolved;
          if (unlocked && room) {
            return (
              <Link
                key={roomId}
                href={`/game/${slug}/room/${roomId}`}
                className="flex items-center justify-center rounded border-2 border-transparent bg-black/0 transition-colors hover:border-amber-400/60 hover:bg-amber-500/10"
                aria-label={`${room.title} - ${t.goToRoom}`}
                title={room.title}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-lg font-bold text-white backdrop-blur-sm">
                  {solved ? "✓" : roomId}
                </span>
              </Link>
            );
          }
          return (
            <div
              key={roomId}
              className="flex cursor-not-allowed items-center justify-center rounded bg-black/20"
              title="Kilitli"
              aria-hidden
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800/80 text-sm text-zinc-500">
                🔒
              </span>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="flex min-h-[200px] items-center justify-center bg-zinc-900/50 text-5xl text-zinc-600 md:min-h-[400px]" aria-hidden>
      🗺️
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-950/80"
        aria-hidden
      />
      <main className="relative z-10 flex min-h-screen flex-col px-4 py-20 pb-24 sm:px-6 sm:py-16 md:flex-row md:gap-0 md:px-0 md:pt-16">
        <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between sm:left-6 sm:right-6 sm:top-6">
          <Link
            href={`/game/${slug}/intro`}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-sm text-zinc-500 transition-colors hover:text-amber-500 sm:px-2"
          >
            {t.backToIntro}
          </Link>
          <RestartButton slug={slug} label="Oyunu Yeniden Başlat" />
        </div>

        {/* Sol yarı (mobil: üstten aşağı – sayaç, başlık, harita, hikâye, odalar, final) */}
        <div className="flex w-full flex-col gap-6 pt-12 sm:gap-8 md:max-h-screen md:min-w-0 md:flex-1 md:overflow-y-auto md:pt-20 md:pl-6 md:pr-4 lg:pl-8 lg:pr-6">
          <div className="flex flex-col items-center gap-2">
            <CountdownTimer
              slug={slug}
              initialMinutes={durationMinutes}
              ariaLabelTemplate={timerAriaLabel}
            />
            <h1 className="text-center text-xl font-bold tracking-tight text-white drop-shadow-lg sm:text-2xl md:text-3xl lg:text-4xl">
              {gameTitle}
            </h1>
          </div>

          {/* Mobilde: harita hemen başlık altında */}
          <section className="w-full rounded-lg border border-zinc-800/50 bg-zinc-900/40 overflow-hidden md:hidden">
            <h2 className="border-b border-zinc-700/50 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-amber-500/90">
              {t.map}
            </h2>
            <div className="relative min-h-[220px] bg-zinc-900/50 p-2">
              {mapContent}
            </div>
          </section>

          <section className="w-full rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-4 sm:px-6 sm:py-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-500/90">
              {t.story}
            </h2>
            <div className="whitespace-pre-line text-base leading-relaxed text-zinc-300 sm:text-lg">
              {story}
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

        {/* Sağ yarı (sadece web): büyük harita, tıklanabilir segmentler */}
        <aside className="hidden md:flex md:min-h-screen md:w-1/2 md:flex-shrink-0 md:flex-col lg:w-[55%]">
          <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden border-l border-zinc-800/50 bg-zinc-950/95 p-4 lg:p-6">
            <div className="relative h-full w-full max-w-4xl">
              {mapContent}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
