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

const MAP_IMAGE_PATH = "/games/tapinagin-laneti/images/map.jpg";

/** Harita üzerinde oda tıklama alanları (yüzde: top, left, width, height). Haritadaki 1–6 numaralı konumlara göre ayarlanabilir. */
const MAP_SEGMENTS: { id: number; top: number; left: number; width: number; height: number }[] = [
  { id: 1, top: 8, left: 4, width: 26, height: 40 },
  { id: 2, top: 8, left: 36, width: 26, height: 40 },
  { id: 3, top: 8, left: 69, width: 26, height: 40 },
  { id: 4, top: 55, left: 4, width: 26, height: 40 },
  { id: 5, top: 55, left: 36, width: 26, height: 40 },
  { id: 6, top: 55, left: 69, width: 26, height: 40 },
];

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

  const maxSolved = getStoredMaxSolvedRoomIndex(slug, roomIds);
  const activeRoomId = roomIds[maxSolved + 1] ?? null;

  const mapContent = !mapError ? (
    <div className="relative h-full min-h-[200px] w-full md:min-h-[400px]">
      <img
        src={MAP_IMAGE_PATH}
        alt="Tapınak haritası - odalara tıklayarak gidebilirsiniz"
        className="h-full w-full object-contain"
        onError={() => setMapError(true)}
      />
      <div className="absolute inset-0" aria-hidden>
        {MAP_SEGMENTS.map((seg) => {
          const roomId = seg.id;
          const room = rooms.find((r) => r.id === roomId);
          const unlocked = unlockedIds.includes(roomId);
          const roomIndex = rooms.findIndex((r) => r.id === roomId);
          const solved = roomIndex >= 0 && roomIndex <= maxSolved;
          const active = unlocked && !solved && roomId === activeRoomId;
          const style = {
            top: `${seg.top}%`,
            left: `${seg.left}%`,
            width: `${seg.width}%`,
            height: `${seg.height}%`,
          };
          if (!unlocked || !room) {
            return (
              <div
                key={roomId}
                className="absolute flex cursor-not-allowed items-center justify-center rounded bg-black/10 pointer-events-none opacity-70"
                style={style}
                title="Kilitli"
                aria-hidden
              >
                <span className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-zinc-800/90 text-base text-zinc-500 shadow-inner">
                  🔒
                </span>
              </div>
            );
          }
          return (
            <Link
              key={roomId}
              href={`/game/${slug}/room/${roomId}`}
              className={`absolute flex cursor-pointer items-center justify-center rounded transition-all duration-200 touch-manipulation ${
                active
                  ? "ring-2 ring-amber-400/80 ring-offset-2 ring-offset-zinc-900/80 shadow-[0_0_16px_rgba(251,191,36,0.35)]"
                  : solved
                    ? "hover:ring-2 hover:ring-emerald-400/40"
                    : "hover:ring-2 hover:ring-amber-400/50 hover:shadow-[0_0_12px_rgba(251,191,36,0.2)]"
              }`}
              style={style}
              aria-label={`${room.title} - ${t.goToRoom}`}
              title={room.title}
            >
              <span
                className={`flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-lg font-bold backdrop-blur-sm ${
                  solved
                    ? "bg-emerald-900/70 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.25)]"
                    : active
                      ? "bg-amber-500/30 text-amber-200 ring-1 ring-amber-400/50"
                      : "bg-black/50 text-amber-400"
                }`}
              >
                {solved ? "✓" : roomId}
              </span>
            </Link>
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
    <div className="relative min-h-screen overflow-x-hidden bg-zinc-950">
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

        {/* Sol yarı: tek scroll ile sayfa kayar, içerik doğal yükseklikte */}
        <div className="flex w-full flex-col gap-6 pt-12 sm:gap-8 md:min-w-0 md:flex-[1.4] md:pt-20 md:pl-6 md:pr-4 lg:flex-[1.5] lg:pl-8 lg:pr-6 lg:pb-12">
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

          <section className="w-full rounded-lg border border-zinc-800/50 bg-zinc-900/40 px-4 py-4 sm:px-6 sm:py-5" aria-label="Oda ilerleme durumu">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-500/90">
              {t.rooms}
            </h2>
            <p className="mb-3 text-xs text-zinc-500">
              Odalara haritadan girin. Bu liste sadece ilerleme göstergesidir.
            </p>
            <div className="grid gap-3 sm:grid-cols-2" role="list">
              {rooms.map((room) => {
                const unlocked = unlockedIds.includes(room.id);
                const maxSolved = getStoredMaxSolvedRoomIndex(slug, roomIds);
                const roomIndex = rooms.findIndex((r) => r.id === room.id);
                const solved = roomIndex >= 0 && roomIndex <= maxSolved;
                return (
                  <div
                    key={room.id}
                    role="listitem"
                    className={`flex cursor-default items-center gap-3 rounded-lg border-2 px-4 py-3 ${
                      unlocked
                        ? solved
                          ? "border-emerald-700/50 bg-emerald-950/20"
                          : "border-zinc-700 bg-zinc-800/50"
                        : "border-zinc-700/50 bg-zinc-800/30 opacity-60"
                    }`}
                    aria-label={`${room.title}: ${unlocked ? (solved ? "Çözüldü" : "Açık") : "Kilitli"}`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${
                        solved
                          ? "bg-emerald-900/50 text-emerald-400"
                          : unlocked
                            ? "bg-amber-900/30 text-amber-400"
                            : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {solved ? "✓" : unlocked ? room.id : "🔒"}
                    </span>
                    <span className={`font-medium ${unlocked ? "text-zinc-200" : "text-zinc-500"}`}>
                      {room.title}
                    </span>
                    {unlocked && !solved && (
                      <span className="ml-auto text-xs text-amber-500/70">Açık</span>
                    )}
                    {solved && <span className="ml-auto text-xs text-emerald-400/80">Çözüldü</span>}
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

        {/* Sağ yarı (sadece web): harita sticky, sayfa kayarken ekranda sabit kalır */}
        <aside className="hidden md:flex md:sticky md:top-0 md:h-screen md:w-[38%] md:flex-shrink-0 md:self-start lg:w-[42%] xl:max-w-[520px]">
          <div className="flex h-full w-full items-center justify-center border-l border-zinc-800/50 bg-zinc-950/95 p-4 lg:p-6">
            <div className="relative h-full w-full min-h-0">
              {mapContent}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
