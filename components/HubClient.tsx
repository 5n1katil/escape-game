"use client";

import CountdownTimer from "@/components/CountdownTimer";
import RestartButton from "@/components/RestartButton";
import type { Room } from "@/data/rooms";
import { calculateScore } from "@/lib/gameSession";
import {
  getActiveMemberId,
  getMemberIdFromUrl,
  getPlayerSession,
  getStoredMaxSolvedRoomIndex,
  getStoredPlayerName,
  normalizePlayerName,
  setCompletedGameResult,
  setStoredEscaped,
} from "@/lib/gameStorage";
import { isCorrectFinalCode } from "@/lib/rooms";
import type { Translations } from "@/lib/i18n";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/** Tapınak haritası (public/images/temple-map.jpg — oyun map ile senkron tutulur). */
const MAP_IMAGE_PATH = "/images/temple-map.jpg";

/** Harita üzerinde oda tıklama alanları (yüzde: top, left, width, height). */
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
  /** Lobi hikâye seslendirmesi (varsa HİKAYE bölümünde oynatıcı gösterilir). */
  storyAudioUrl?: string | null;
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
  storyAudioUrl,
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
  const leftColumnRef = useRef<HTMLDivElement>(null);

  const roomIds = rooms.map((r) => r.id);

  const refreshSession = useCallback(() => {
    const session = getPlayerSession(slug);
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
      const session = getPlayerSession(slug);
      if (session) {
        const scoreResult = calculateScore(session);
        const completionTime = Math.max(0, session.durationSeconds - scoreResult.remainingTime);
        const playerName = normalizePlayerName(getStoredPlayerName(slug));
        const memberId = getActiveMemberId() || getMemberIdFromUrl() || null;
        console.log("HUB memberId:", memberId);
        setCompletedGameResult(slug, {
          score: scoreResult.finalScore,
          completionTime,
          remainingTime: scoreResult.remainingTime,
          mistakes: scoreResult.totalAttempts,
          attempts: scoreResult.totalAttempts,
          memberId,
          avatarUrl: null,
          playerName,
          slug,
          roomsSolvedFirstTry: scoreResult.roomsSolvedFirstTry,
          roomsSolvedSecondTry: scoreResult.roomsSolvedSecondTry,
          scoreBreakdown: scoreResult.scoreBreakdown,
        });
      }
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

  const segmentStyle = (seg: (typeof MAP_SEGMENTS)[0]) => ({
    top: `${seg.top}%`,
    left: `${seg.left}%`,
    width: `${seg.width}%`,
    height: `${seg.height}%`,
  });

  /** Tam ekran hissi: resim z-0, şeffaf yüzde kutular z-10 (kilitli / açık mantığı aynı). */
  const mapContent = !mapError ? (
    <div
      className="relative z-0 h-full min-h-[200px] w-full overflow-hidden bg-zinc-900"
      role="img"
      aria-label="Tapınak haritası - odalara tıklayarak gidebilirsiniz"
    >
      <img
        src={MAP_IMAGE_PATH}
        alt=""
        className="absolute inset-0 z-0 h-full w-full object-cover"
        onError={() => setMapError(true)}
      />
      <div className="absolute inset-0 z-10">
        {MAP_SEGMENTS.map((seg) => {
          const roomId = seg.id;
          const room = rooms.find((r) => r.id === roomId);
          const unlocked = unlockedIds.includes(roomId);
          const roomIndex = rooms.findIndex((r) => r.id === roomId);
          const solved = roomIndex >= 0 && roomIndex <= maxSolved;
          const active = unlocked && !solved && roomId === activeRoomId;
          const style = segmentStyle(seg);
          if (!unlocked || !room) {
            return (
              <div
                key={roomId}
                className="pointer-events-none absolute flex items-center justify-center rounded-md border border-purple-500/10 bg-transparent opacity-60"
                style={style}
                title="Kilitli"
                aria-hidden
              >
                <span className="text-2xl font-bold text-zinc-500">{roomId}</span>
              </div>
            );
          }
          return (
            <Link
              key={roomId}
              href={`/game/${slug}/room/${roomId}`}
              className={`absolute flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-purple-500/20 bg-transparent text-2xl font-bold text-white transition-colors duration-200 touch-manipulation hover:border-purple-500 hover:bg-purple-500/10 ${
                active ? "ring-2 ring-amber-400/80 ring-offset-2 ring-offset-zinc-950/90" : ""
              } ${solved ? "border-emerald-500/35" : ""}`}
              style={style}
              aria-label={`${room.title} - ${t.goToRoom}`}
              title={room.title}
            >
              {roomId}
            </Link>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="flex h-full min-h-[200px] w-full items-center justify-center bg-zinc-900/50 text-5xl text-zinc-600" aria-hidden>
      🗺️
    </div>
  );

  return (
    <div className="relative h-screen max-h-[100dvh] min-h-0 overflow-hidden bg-zinc-950">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-950/80"
        aria-hidden
      />
      <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between sm:left-6 sm:right-6 sm:top-6">
        <Link
          href={`/game/${slug}/intro`}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-sm text-zinc-500 transition-colors hover:text-amber-500 sm:px-2"
        >
          {t.backToIntro}
        </Link>
        <RestartButton slug={slug} label="Oyunu Yeniden Başlat" />
      </div>

      <main className="relative z-10 box-border flex h-full min-h-0 flex-col pt-14 sm:pt-16 md:flex-row md:gap-0 md:px-0 md:pt-14">
        {/* Sol: tek scroll alanı; sağ harita masaüstünde sabit yükseklikte kalır */}
        <div
          ref={leftColumnRef}
          className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto overscroll-y-contain px-4 pb-6 sm:gap-5 sm:px-6 sm:pb-8 md:min-w-0 md:flex-[1.4] md:pl-6 md:pr-4 lg:flex-[1.5] lg:pl-8 lg:pr-6"
        >
          <section className="flex flex-row flex-wrap items-center justify-center gap-3 rounded-xl border border-zinc-700/60 bg-zinc-900/50 px-4 py-3 sm:gap-4 sm:px-5 sm:py-3.5">
            <CountdownTimer
              slug={slug}
              initialMinutes={durationMinutes}
              ariaLabelTemplate={timerAriaLabel}
              compact
            />
            <h1 className="text-center text-lg font-bold tracking-tight text-white drop-shadow-md sm:text-xl md:text-2xl">
              {gameTitle}
            </h1>
          </section>

          {/* Mobilde: metin panelinden önce; img + şeffaf yüzde kutular (SVG yok) */}
          <section className="w-full shrink-0 overflow-hidden rounded-lg border border-zinc-800/50 bg-zinc-900/40 md:hidden">
            <h2 className="border-b border-zinc-700/50 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-amber-500/90">
              {t.map}
            </h2>
            <div className="bg-zinc-900/50 p-2">
              <div className="relative mx-auto aspect-[4/3] w-full min-h-[200px] max-h-[min(50vh,420px)]">
                {mapContent}
              </div>
            </div>
          </section>

          <section className="w-full rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-3 sm:px-6 sm:py-4">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-500/90">
              {t.story}
            </h2>
            {storyAudioUrl && (
              <div className="mb-3">
                <p className="mb-1.5 text-xs text-zinc-500">
                  {t.storyAudioLabel}
                </p>
                <audio controls src={encodeURI(storyAudioUrl)} className="h-9 w-full max-w-md sm:h-10" preload="metadata" />
              </div>
            )}
            <div className="whitespace-pre-line text-base leading-relaxed text-zinc-300 sm:text-lg">
              {story}
            </div>
          </section>

          <section className="w-full rounded-lg border border-zinc-800/50 bg-zinc-900/40 px-4 py-3 sm:px-6 sm:py-4" aria-label="Oda ilerleme durumu">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-500/90">
              {t.rooms}
            </h2>
            <p className="mb-3 text-xs text-zinc-500">
              Odalara haritadan veya bu listeden girebilirsiniz. İpucu için çözülmüş odaya tıklayın.
            </p>
            <div className="grid gap-3 sm:grid-cols-2" role="list">
              {rooms.map((room) => {
                const unlocked = unlockedIds.includes(room.id);
                const maxSolved = getStoredMaxSolvedRoomIndex(slug, roomIds);
                const roomIndex = rooms.findIndex((r) => r.id === room.id);
                const solved = roomIndex >= 0 && roomIndex <= maxSolved;
                const itemClass = `flex items-center gap-3 rounded-lg border-2 px-4 py-3 ${
                  unlocked
                    ? solved
                      ? "border-emerald-700/50 bg-emerald-950/20 cursor-pointer hover:bg-emerald-950/30 transition-colors"
                      : "border-zinc-700 bg-zinc-800/50 cursor-pointer hover:bg-zinc-800 transition-colors"
                    : "border-zinc-700/50 bg-zinc-800/30 opacity-60 cursor-default"
                }`;
                const content = (
                  <>
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
                      <span className="ml-auto text-xs text-amber-500/70">{t.goToRoom}</span>
                    )}
                    {solved && (
                      <span className="ml-auto text-xs text-emerald-400/80">Çözüldü · {t.goToRoom}</span>
                    )}
                  </>
                );
                return (
                  <div key={room.id} role="listitem">
                    {unlocked ? (
                      <Link
                        href={`/game/${slug}/room/${room.id}`}
                        className={itemClass}
                        aria-label={`${room.title}: ${solved ? "Çözüldü" : "Açık"} - ${t.goToRoom}`}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className={itemClass} aria-label={`${room.title}: Kilitli`}>
                        {content}
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
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => leftColumnRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
                  className="w-full rounded-lg border border-amber-700/50 bg-amber-950/40 py-2.5 text-sm font-medium text-amber-200/90 transition-colors hover:bg-amber-900/50"
                >
                  {t.backToTemple}
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Sağ: relative + h-full; harita img object-cover, önde şeffaf yüzde kutular */}
        <aside className="relative hidden min-h-0 md:flex md:h-full md:w-[38%] md:shrink-0 lg:w-[42%] xl:max-w-[520px]">
          <div className="sticky top-0 flex h-full min-h-0 w-full flex-col border-l border-zinc-800/50 bg-zinc-950/95">
            <div className="relative flex min-h-0 flex-1 overflow-hidden p-3 lg:p-5">
              {mapContent}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
