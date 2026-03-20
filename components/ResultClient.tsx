"use client";

import { saveScore } from "@/lib/firebase";
import {
  getActivePlayerKey,
  getCompletedGameResult,
  getStoredEscaped,
  restartPlayerSession,
  type FinalGameResult,
} from "@/lib/gameStorage";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Translations } from "@/lib/i18n";

const FIREBASE_DB_BASE =
  "https://n1dedektif-leaderboard-default-rtdb.europe-west1.firebasedatabase.app";

/** Leaderboard satırı. time = bitirme süresi (saniye, completionTime). */
export interface LeaderboardEntry {
  name: string;
  score: number;
  /** Bitirme süresi (saniye). Firebase "time" alanı. */
  time: number;
  /** Leaderboard deneme değeri: firstCompletionAttempt. */
  attempt: number;
}

type GameLeaderboardRow = {
  name?: string;
  score?: number;
  baseScore?: number;
  time?: number;
  mistakes?: number;
  attemptCount?: number;
  firstCompletionAttempt?: number;
  type?: string;
  game?: string;
  updatedAt?: number;
};

type GlobalLeaderboardRow = {
  name?: string;
  totalScore?: number;
  gamesPlayed?: number;
  updatedAt?: number;
};

type LeaderboardMode = "game" | "global";

interface LeaderboardFilterState {
  mode: LeaderboardMode;
  type: "escape_room" | "cases";
  gameKey: string;
}

interface ResultClientProps {
  slug: string;
  gameTitle: string;
  durationSeconds: number;
  wixUrl: string;
  /** Ana sayfa URL (sonuç ekranında "Ana Sayfaya Dön" butonu). */
  mainPageUrl?: string;
  tResult: Translations["result"];
  tRoomResult: Translations["room"]["result"];
  endStoryLong?: string;
  endAudioUrl?: string;
  endImageUrl?: string;
  gizemMalikanesiUrl?: string;
  gizemMalikanesiLabel?: string;
}

function formatTime(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = clamped % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/**
 * Oyun bazlı leaderboard okuma:
 * leaderboards/{type}/{gameKey}/{playerKey}
 */
async function fetchGameLeaderboard(
  type: string,
  gameKey: string,
  limit: number
): Promise<LeaderboardEntry[]> {
  const path = `/leaderboards/${encodeURIComponent(type)}/${encodeURIComponent(
    gameKey
  )}.json`;
  const res = await fetch(`${FIREBASE_DB_BASE}${path}`);
  if (!res.ok) return [];
  const data: Record<string, GameLeaderboardRow> | null = await res.json();
  if (!data || typeof data !== "object") return [];
  const entries: LeaderboardEntry[] = Object.entries(data).map(([key, row]) => ({
    name: (row.name ?? key.replace(/_/g, " ")).toString().trim() || "—",
    score: typeof row.score === "number" ? row.score : 0,
    time: typeof row.time === "number" ? row.time : 0,
    attempt:
      typeof row.firstCompletionAttempt === "number"
        ? row.firstCompletionAttempt
        : typeof row.attemptCount === "number"
          ? row.attemptCount
          : 0,
  }));
  entries.sort((a, b) => b.score - a.score || a.time - b.time);
  return entries.slice(0, limit);
}

/**
 * Global total leaderboard okuma:
 * globalLeaderboard/{playerKey}
 * Burada score = totalScore.
 */
async function fetchGlobalLeaderboard(limit: number): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${FIREBASE_DB_BASE}/globalLeaderboard.json`);
  if (!res.ok) return [];
  const data: Record<string, GlobalLeaderboardRow> | null = await res.json();
  if (!data || typeof data !== "object") return [];
  const entries: LeaderboardEntry[] = Object.entries(data).map(([key, row]) => ({
    name: (row.name ?? key.replace(/_/g, " ")).toString().trim() || "—",
    score: typeof row.totalScore === "number" ? row.totalScore : 0,
    time: 0,
    attempt: 0,
  }));
  entries.sort((a, b) => b.score - a.score);
  return entries.slice(0, limit);
}

async function resolveLeaderboardData(
  filter: LeaderboardFilterState,
  limit: number
): Promise<LeaderboardEntry[]> {
  if (filter.mode === "global") {
    return fetchGlobalLeaderboard(limit);
  }
  // mode === "game"
  return fetchGameLeaderboard(filter.type, filter.gameKey, limit);
}

export default function ResultClient({
  slug,
  gameTitle,
  durationSeconds,
  wixUrl,
  mainPageUrl,
  tResult,
  tRoomResult,
  endStoryLong,
  endAudioUrl,
  endImageUrl,
  gizemMalikanesiUrl,
  gizemMalikanesiLabel,
}: ResultClientProps) {
  const router = useRouter();
  const [escaped, setEscaped] = useState<boolean | null>(null);
  const [finalResult, setFinalResult] = useState<FinalGameResult | null | "missing">(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(null);
  const [leaderboardError, setLeaderboardError] = useState(false);
  const [leaderboardFilter, setLeaderboardFilter] = useState<LeaderboardFilterState>({
    mode: "game",
    type: "escape_room",
    gameKey: slug,
  });
  const scoreSavedRef = useRef(false);

  useEffect(() => {
    const isEscaped = getStoredEscaped(slug) === true;
    setEscaped(isEscaped);
    if (!isEscaped) {
      router.replace(`/game/${slug}/hub`);
      return;
    }
    const playerKey = getActivePlayerKey();
    if (!playerKey) {
      setFinalResult("missing");
      return;
    }
    const stored = getCompletedGameResult(playerKey, slug);
    setFinalResult(stored ?? "missing");
  }, [slug, router]);

  useEffect(() => {
    if (finalResult === null || finalResult === "missing" || scoreSavedRef.current) return;
    scoreSavedRef.current = true;
    (async () => {
      try {
        await saveScore(
          finalResult.playerName,
          finalResult.slug,
          finalResult.score,
          finalResult.completionTime,
          finalResult.mistakes
        );
      } catch {
        // ignore
      }
    })();
  }, [finalResult]);

  useEffect(() => {
    if (!escaped) return;
    let cancelled = false;
    (async () => {
      try {
        const top = await resolveLeaderboardData(leaderboardFilter, 5);
        if (!cancelled) {
          setLeaderboard(top);
          setLeaderboardError(false);
        }
      } catch {
        if (!cancelled) {
          setLeaderboard(null);
          setLeaderboardError(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [escaped, leaderboardFilter]);

  if (escaped === null || !escaped) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (finalResult === "missing" || finalResult === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <p className="text-center text-zinc-400">{tResult.resultNotFound}</p>
      </div>
    );
  }

  const storyText = endStoryLong ?? tResult.endStory;

  const backUrl = mainPageUrl ?? wixUrl;
  const backLabel = mainPageUrl ? tResult.backToMain : tResult.backToWix;

  function handlePlayAgain() {
    restartPlayerSession(slug, durationSeconds, 1);
    router.push(`/game/${slug}/hub`);
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 sm:py-16">
      <main className="mx-auto max-w-6xl space-y-8 lg:space-y-10">
        {/* Üst: sol = başlık + puan + liderlik, sağ = görsel */}
        <div className="flex flex-col gap-8 md:flex-row md:gap-10 lg:gap-12">
          <div className="flex flex-1 flex-col space-y-6 md:max-w-md md:flex-none sm:space-y-8">
            <header>
              <p className="text-sm font-medium uppercase tracking-wider text-amber-500/90">{gameTitle}</p>
              <h1 className="mt-2 text-2xl font-bold text-amber-400 sm:text-3xl">
                {tResult.endTitle}
              </h1>
              <p className="mt-2 text-sm text-zinc-400">{tResult.endStory}</p>
              <p className="mt-2 text-sm text-zinc-400">
                Dedektif: <span className="font-medium text-zinc-200">{finalResult.playerName}</span>
              </p>
            </header>

            <section
              className="rounded-xl border border-amber-500/25 bg-amber-950/20 px-4 py-5 sm:px-6 sm:py-6"
              role="region"
              aria-label={tRoomResult.title}
            >
              <h2 className="text-center text-lg font-semibold text-amber-300 sm:text-xl">
                {tRoomResult.title}
              </h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex justify-between rounded-lg bg-zinc-900/50 px-4 py-2 sm:flex-col sm:gap-0">
                  <dt className="text-sm text-zinc-400">{tRoomResult.finalScore}</dt>
                  <dd className="text-lg font-bold text-white tabular-nums">{finalResult.score}</dd>
                </div>
                <div className="flex justify-between rounded-lg bg-zinc-900/50 px-4 py-2 sm:flex-col sm:gap-0">
                  <dt className="text-sm text-zinc-400">{tRoomResult.remainingTime}</dt>
                  <dd className="text-lg font-medium text-zinc-200 tabular-nums">
                    {formatTime(finalResult.remainingTime)}
                  </dd>
                </div>
                <div className="flex justify-between rounded-lg bg-zinc-900/50 px-4 py-2 sm:flex-col sm:gap-0">
                  <dt className="text-sm text-zinc-400">{tRoomResult.completionTime}</dt>
                  <dd className="text-lg font-medium text-zinc-200 tabular-nums">
                    {formatTime(finalResult.completionTime)}
                  </dd>
                </div>
                <div className="flex justify-between rounded-lg bg-zinc-900/50 px-4 py-2 sm:flex-col sm:gap-0">
                  <dt className="text-sm text-zinc-400">{tRoomResult.totalAttempts}</dt>
                  <dd className="text-lg font-medium text-zinc-200 tabular-nums">
                    {finalResult.attempts ?? finalResult.mistakes}
                  </dd>
                </div>
                <div className="flex justify-between rounded-lg bg-zinc-900/50 px-4 py-2 sm:flex-col sm:gap-0">
                  <dt className="text-sm text-zinc-400">{tRoomResult.firstTryCount}</dt>
                  <dd className="text-lg font-medium text-zinc-200 tabular-nums">
                    {finalResult.roomsSolvedFirstTry}
                  </dd>
                </div>
              </dl>
            </section>

            <section
              className="rounded-xl border border-zinc-700/50 bg-zinc-900/40 px-4 py-5 sm:px-6"
              aria-label={tResult.leaderboardTitle}
            >
              <h2 className="text-center text-base font-semibold text-amber-500/90 sm:text-lg">
                {tResult.leaderboardTitle}
              </h2>
              <div className="mt-3 flex justify-center gap-2 text-xs sm:mt-4 sm:text-sm">
                <button
                  type="button"
                  onClick={() =>
                    setLeaderboardFilter((prev) => ({
                      ...prev,
                      mode: "game",
                      type: "escape_room",
                      gameKey: slug,
                    }))
                  }
                  className={`rounded-full px-3 py-1.5 transition-colors ${
                    leaderboardFilter.mode === "game"
                      ? "bg-amber-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  Oyun Skoru
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLeaderboardFilter((prev) => ({
                      ...prev,
                      mode: "global",
                    }))
                  }
                  className={`rounded-full px-3 py-1.5 transition-colors ${
                    leaderboardFilter.mode === "global"
                      ? "bg-amber-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  Toplam Puan
                </button>
              </div>
              {leaderboardError && (
                <p className="mt-4 text-center text-sm text-zinc-500">{tResult.leaderboardError}</p>
              )}
              {!leaderboardError && leaderboard === null && (
                <p className="mt-4 text-center text-sm text-zinc-500">{tResult.leaderboardLoading}</p>
              )}
              {!leaderboardError && leaderboard && leaderboard.length > 0 && (
                <>
                  <div className="mt-4 flex justify-between rounded-t-lg bg-zinc-800/80 px-4 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    <span>#</span>
                    <span>{tResult.leaderboardScoreTimeHeader}</span>
                  </div>
                  <ol className="space-y-2">
                    {leaderboard.map((entry, i) => (
                      <li
                        key={entry.name + i}
                        className="flex items-center justify-between rounded-lg bg-zinc-800/60 px-4 py-2.5 text-left"
                      >
                        <span className="font-medium text-zinc-200">
                          {i + 1}. {entry.name}
                        </span>
                        <span className="tabular-nums text-amber-400/90">
                          {leaderboardFilter.mode === "game"
                            ? `${entry.score} · ${formatTime(entry.time)} · ${tResult.leaderboardAttemptLabel}: ${entry.attempt}`
                            : `${entry.score}`}
                        </span>
                      </li>
                    ))}
                  </ol>
                </>
              )}
              {!leaderboardError && leaderboard && leaderboard.length === 0 && (
                <p className="mt-4 text-center text-sm text-zinc-500">{tResult.leaderboardError}</p>
              )}
            </section>
          </div>

          {/* Sağ: sadece görsel */}
          <div className="flex flex-1 flex-col md:min-w-0">
            {endImageUrl && (
              <div className="overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-900/50">
                <img
                  src={encodeURI(endImageUrl)}
                  alt=""
                  className="h-auto w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Oyun sonu hikayesi: tam genişlik */}
        <section
          className="w-full rounded-xl border border-zinc-700/50 bg-zinc-900/40 px-5 py-6 sm:px-8 sm:py-8 md:px-10"
          aria-label={tResult.endStoryHeading}
        >
          <h2 className="text-base font-semibold text-amber-500/90 sm:text-lg">
            {tResult.endStoryHeading}
          </h2>
          {endAudioUrl && (
            <div className="mt-3 flex flex-col gap-2 sm:mt-4">
              <span className="text-xs font-medium text-zinc-500 sm:text-sm">
                {tResult.endStoryAudioLabel}
              </span>
              <audio
                controls
                src={encodeURI(endAudioUrl)}
                className="h-10 w-full max-w-md"
                preload="metadata"
              />
            </div>
          )}
          <p className="mt-4 max-w-none whitespace-pre-line text-sm leading-relaxed text-zinc-300 sm:text-base">
            {storyText}
          </p>
        </section>

        {/* Butonlar: hikayenin altında, tam genişlikte, görünür ve kolay tıklanabilir */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-4 sm:gap-6 sm:py-6">
          {gizemMalikanesiUrl && gizemMalikanesiLabel && (
            <a
              href={gizemMalikanesiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] min-w-[220px] flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 px-8 py-3.5 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-zinc-900 active:scale-[0.98]"
            >
              {gizemMalikanesiLabel}
            </a>
          )}
          <button
            type="button"
            onClick={handlePlayAgain}
            className="inline-flex min-h-[52px] min-w-[220px] flex-shrink-0 items-center justify-center rounded-xl border-2 border-amber-700/60 bg-transparent px-8 py-3.5 text-lg font-semibold text-amber-100/90 transition-colors hover:border-amber-600/80 hover:bg-amber-900/20 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900 active:scale-[0.98]"
          >
            {tResult.playAgain}
          </button>
          <a
            href={backUrl}
            className="inline-flex min-h-[52px] min-w-[220px] flex-shrink-0 items-center justify-center rounded-xl bg-amber-600 px-8 py-3.5 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900 active:scale-[0.98]"
          >
            {backLabel}
          </a>
        </div>
      </main>
    </div>
  );
}
