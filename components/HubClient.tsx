"use client";

import CountdownTimer from "@/components/CountdownTimer";
import { useGameUi } from "@/components/GameVisualThemeProvider";
import RestartButton from "@/components/RestartButton";
import TempleMap from "@/components/TempleMap";
import type { Room } from "@/data/rooms";
import { fetchUserAvatarFromRtdb } from "@/lib/firebase";
import { calculateScore } from "@/lib/gameSession";
import {
  getActiveAvatarUrl,
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
  /** Mobilde yapışkan sayaç çubuğu (Room ile aynı “Kalan zaman” etiketi). */
  timerHudLabel: string;
  durationMinutes: number;
  mapImageSrc: string;
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
  timerHudLabel,
  durationMinutes,
  mapImageSrc,
}: HubClientProps) {
  const { ui } = useGameUi();
  const h = ui.hub;
  const router = useRouter();
  const [unlockedIds, setUnlockedIds] = useState<number[]>([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const [finalInput, setFinalInput] = useState("");
  const [finalError, setFinalError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [finalSubmitting, setFinalSubmitting] = useState(false);
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

  const allSolved = mounted && solvedCount >= rooms.length;
  const showFinalCode = allSolved && finalCode;

  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFinalError(null);
    const trimmed = finalInput.trim();
    if (!trimmed || !finalCode || finalSubmitting) return;
    if (isCorrectFinalCode(finalCode, trimmed)) {
      const session = getPlayerSession(slug);
      if (!session) return;
      setFinalSubmitting(true);
      try {
        const scoreResult = calculateScore(session);
        const completionTime = Math.max(0, session.durationSeconds - scoreResult.remainingTime);
        const playerName = normalizePlayerName(getStoredPlayerName(slug));
        const memberId = getActiveMemberId() || getMemberIdFromUrl() || null;
        let avatarUrl = getActiveAvatarUrl();
        if (!avatarUrl?.trim() && memberId) {
          avatarUrl = await fetchUserAvatarFromRtdb(memberId);
        }
        console.log("HUB memberId:", memberId, "avatar resolved:", Boolean(avatarUrl?.trim()));
        setCompletedGameResult(slug, {
          score: scoreResult.finalScore,
          completionTime,
          remainingTime: scoreResult.remainingTime,
          mistakes: scoreResult.totalAttempts,
          attempts: scoreResult.totalAttempts,
          memberId,
          avatarUrl: avatarUrl?.trim() || null,
          playerName,
          slug,
          roomsSolvedFirstTry: scoreResult.roomsSolvedFirstTry,
          roomsSolvedSecondTry: scoreResult.roomsSolvedSecondTry,
          scoreBreakdown: scoreResult.scoreBreakdown,
        });
        setStoredEscaped(slug, true);
        router.push(`/game/${slug}/result`);
      } finally {
        setFinalSubmitting(false);
      }
    } else {
      setFinalError(t.finalCodeWrong);
    }
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className={`h-10 w-10 animate-spin rounded-full border-2 ${ui.spinner}`} />
      </div>
    );
  }

  return (
    <div className="relative h-screen max-h-[100dvh] min-h-0 overflow-hidden bg-zinc-950">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-950/80"
        aria-hidden
      />
      <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between sm:left-6 sm:right-6 sm:top-6">
        <Link
          href={`/game/${slug}/intro`}
          className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-sm text-zinc-500 transition-colors sm:px-2 ${h.backLink}`}
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
          {/* Mobil: sayaç sol sütun scroll’unda yapışkan; masaüstü: mevcut kutu + başlık */}
          <div className="sticky top-0 z-50 w-full shrink-0 md:static md:z-auto">
            <div className="-mx-4 border-b border-amber-900/45 bg-zinc-950/95 shadow-[0_6px_20px_rgba(0,0,0,0.4)] backdrop-blur-md sm:-mx-6 md:mx-0 md:border-0 md:bg-transparent md:shadow-none md:backdrop-blur-none">
              <div className="md:hidden">
                <CountdownTimer
                  slug={slug}
                  initialMinutes={durationMinutes}
                  ariaLabelTemplate={timerAriaLabel}
                  variant="mobileBar"
                  label={timerHudLabel}
                />
              </div>
            </div>
          </div>
          <h1 className="px-2 pb-1 pt-2 text-center text-lg font-bold tracking-tight text-white drop-shadow-md sm:text-xl md:hidden">
            {gameTitle}
          </h1>
          <section className={`hidden flex-row flex-wrap items-center justify-center gap-3 rounded-xl border ${h.desktopCountSection} bg-zinc-900/50 px-4 py-3 sm:gap-4 sm:px-5 sm:py-3.5 md:flex`}>
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
          <section className={`w-full shrink-0 overflow-hidden rounded-lg border ${h.mobileMapWrap} bg-zinc-900/40 md:hidden`}>
            <h2 className={`border-b ${h.mobileMapTitleBar} px-4 py-3 text-sm font-semibold uppercase tracking-wider ${h.sectionTitle}`}>
              {t.map}
            </h2>
            <div className="bg-zinc-900/50 p-2">
              <TempleMap
                slug={slug}
                rooms={rooms}
                goToRoomLabel={t.goToRoom}
                imageFit="contain"
                containImgClassName="max-h-[min(50vh,420px)]"
                mapImageSrc={mapImageSrc}
              />
            </div>
          </section>

          <section className={`w-full rounded-lg border ${h.storySectionBorder} bg-zinc-900/30 px-4 py-3 sm:px-6 sm:py-4`}>
            <h2 className={`mb-2 text-sm font-semibold uppercase tracking-wider ${h.sectionTitle}`}>
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

          <section
            className={`w-full rounded-lg border ${h.roomsSectionBorder} bg-zinc-900/40 px-4 py-3 sm:px-6 sm:py-4`}
            aria-label="Oda ilerleme durumu"
          >
            <h2 className={`mb-3 text-sm font-semibold uppercase tracking-wider ${h.sectionTitle}`}>
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
                      : h.roomOpenItem
                    : "border-zinc-700/50 bg-zinc-800/30 opacity-60 cursor-default"
                }`;
                const content = (
                  <>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${
                        solved
                          ? "bg-emerald-900/50 text-emerald-400"
                          : unlocked
                            ? h.roomOpenBadge
                            : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {solved ? "✓" : unlocked ? room.id : "🔒"}
                    </span>
                    <span className={`font-medium ${unlocked ? "text-zinc-200" : "text-zinc-500"}`}>
                      {room.title}
                    </span>
                    {unlocked && !solved && (
                      <span className={`ml-auto text-xs ${h.roomGoLabel}`}>{t.goToRoom}</span>
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
            <section className={`w-full rounded-lg border ${h.finalWrap} px-4 py-5 sm:px-6`}>
              <h2 className={`mb-3 text-sm font-semibold uppercase tracking-wider ${h.finalTitle}`}>
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
                    className={`w-full rounded-lg border-2 border-zinc-600/50 bg-black/40 px-4 py-3 text-zinc-100 shadow-inner shadow-black/25 placeholder:text-zinc-400 ${h.finalInput}`}
                  />
                  {finalError && (
                    <p className="mt-2 text-sm text-red-400" role="alert">
                      {finalError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!finalInput.trim() || finalSubmitting}
                  className={`w-full rounded-lg ${h.finalSubmit}`}
                >
                  {t.finalCodeSubmit}
                </button>
              </form>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => leftColumnRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
                  className={`w-full rounded-lg py-2.5 text-sm font-medium transition-colors ${h.finalSecondary}`}
                >
                  {t.backToTemple}
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Sağ: relative + h-full; harita img object-cover, önde şeffaf yüzde kutular */}
        <aside className="relative hidden min-h-0 md:flex md:h-full md:w-[38%] md:shrink-0 lg:w-[42%] xl:max-w-[520px]">
          <div className={`sticky top-0 flex h-full min-h-0 w-full flex-col border-l ${h.asideBorder} bg-zinc-950/95`}>
            <div className="relative flex min-h-0 flex-1 overflow-hidden p-3 lg:p-5">
              <TempleMap
                slug={slug}
                rooms={rooms}
                goToRoomLabel={t.goToRoom}
                imageFit="cover"
                className="min-h-0 flex-1 rounded-md"
                mapImageSrc={mapImageSrc}
              />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
