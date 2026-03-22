"use client";

import { fetchUserAvatarFromRtdb, saveScore } from "@/lib/firebase";
import {
  getCompletedGameResult,
  getPlayerKeyForSlug,
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
  time: number | null;
  memberId?: string | null;
  avatarUrl?: string | null;
  /** Firebase leaderboard satırındaki playerName (isim eşlemesi için). */
  playerName?: string | null;
}

type GameLeaderboardRow = {
  name?: string;
  playerName?: string | null;
  memberId?: string | null;
  score?: number;
  baseScore?: number;
  time?: number;
  avatarUrl?: string | null;
  mistakes?: number;
  attemptCount?: number;
  type?: string;
  game?: string;
  updatedAt?: number;
};

type GlobalLeaderboardRow = {
  name?: string;
  playerName?: string | null;
  memberId?: string | null;
  totalScore?: number;
  score?: number;
  avatarUrl?: string | null;
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

const DEFAULT_DETECTIVE_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

/** Wix CDN URL'leri encodeURI ile bozulmasın. */
function safeAvatarImgSrc(url: string): string {
  const t = url.trim();
  if (
    t.startsWith("https://") ||
    t.startsWith("http://") ||
    t.startsWith("/") ||
    t.startsWith("data:")
  ) {
    return t;
  }
  return encodeURI(t);
}

function avatarFromLeaderboardRow(url: string | null | undefined): string {
  const s = typeof url === "string" ? url.trim() : "";
  return s || DEFAULT_DETECTIVE_AVATAR;
}

function normPlayerLabel(s: string | null | undefined): string {
  return (s ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

/** Liderlik satırı + RTDB'den tamamlanan avatar eşlemesi. */
function leaderboardEntryAvatarUrl(
  entry: LeaderboardEntry,
  avatarByMemberId: Record<string, string>
): string {
  const mid = entry.memberId?.trim() ?? "";
  const fromRow = typeof entry.avatarUrl === "string" ? entry.avatarUrl.trim() : "";
  const fromFetch = mid ? avatarByMemberId[mid] : "";
  return avatarFromLeaderboardRow(fromRow || fromFetch || null);
}

/**
 * Aktif oyuncu: memberId → satır; yoksa isim eşlemesi; sonra snapshot + users/ fetch cache.
 */
function activePlayerAvatarUrl(
  result: FinalGameResult,
  leaderboard: LeaderboardEntry[] | null,
  avatarByMemberId: Record<string, string>
): string {
  const mid = result.memberId?.trim() ?? "";
  const fromMap = mid ? avatarByMemberId[mid]?.trim() : "";
  const snap = typeof result.avatarUrl === "string" ? result.avatarUrl.trim() : "";

  if (leaderboard?.length) {
    if (mid) {
      const row = leaderboard.find((e) => e.memberId?.trim() === mid);
      if (row) {
        const u = leaderboardEntryAvatarUrl(row, avatarByMemberId);
        if (u !== DEFAULT_DETECTIVE_AVATAR) return u;
      }
    }
    const pn = normPlayerLabel(result.playerName);
    const rowByName = leaderboard.find(
      (e) =>
        normPlayerLabel(e.playerName) === pn ||
        normPlayerLabel(e.name) === pn
    );
    if (rowByName) {
      const u = leaderboardEntryAvatarUrl(rowByName, avatarByMemberId);
      if (u !== DEFAULT_DETECTIVE_AVATAR) return u;
    }
  }

  if (fromMap) return fromMap;
  if (snap) return snap;
  return DEFAULT_DETECTIVE_AVATAR;
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
  const entries: LeaderboardEntry[] = Object.entries(data).map(([key, row]) => {
    const rowMemberId =
      typeof row.memberId === "string" && row.memberId.trim()
        ? row.memberId.trim()
        : key;
    const pn = typeof row.playerName === "string" ? row.playerName.trim() : "";
    const nm = typeof row.name === "string" ? row.name.trim() : "";
    const name =
      nm || pn || key.replace(/_/g, " ").trim() || "—";
    return {
      name,
      playerName: pn || nm || null,
      score: typeof row.score === "number" ? row.score : 0,
      time: typeof row.time === "number" ? row.time : 0,
      memberId: rowMemberId,
      avatarUrl: typeof row.avatarUrl === "string" ? row.avatarUrl : null,
    };
  });
  entries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.time === null && b.time === null) return 0;
    if (a.time === null) return 1;
    if (b.time === null) return -1;
    return a.time - b.time;
  });
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

  async function fetchAverageCompletionTime(playerKey: string): Promise<number | null> {
    const statsRes = await fetch(
      `${FIREBASE_DB_BASE}/playerGameStats/${encodeURIComponent(playerKey)}.json`
    );
    if (!statsRes.ok) return null;
    const stats: Record<string, { firstCompletionTime?: unknown; bestTime?: unknown; time?: unknown }> | null =
      await statsRes.json();
    if (!stats || typeof stats !== "object") return null;

    let total = 0;
    let count = 0;
    for (const row of Object.values(stats)) {
      const firstCompletionTime =
        typeof row?.firstCompletionTime === "number" && Number.isFinite(row.firstCompletionTime)
          ? row.firstCompletionTime
          : null;
      const legacyBestTime =
        typeof row?.bestTime === "number" && Number.isFinite(row.bestTime) ? row.bestTime : null;
      const legacyTime =
        typeof row?.time === "number" && Number.isFinite(row.time) ? row.time : null;
      const effectiveTime = firstCompletionTime ?? legacyBestTime ?? legacyTime;
      if (effectiveTime !== null) {
        total += effectiveTime;
        count += 1;
      }
    }
    if (count === 0) return null;
    return Math.round(total / count);
  }

  const entries: LeaderboardEntry[] = await Promise.all(
    Object.entries(data).map(async ([key, row]) => {
      const avgTime = await fetchAverageCompletionTime(key);
      const pn = typeof row.playerName === "string" ? row.playerName.trim() : "";
      const nm = typeof row.name === "string" ? row.name.trim() : "";
      const name =
        nm || pn || key.replace(/_/g, " ").trim() || "—";
      return {
        name,
        playerName: pn || nm || null,
        score:
          typeof row.totalScore === "number"
            ? row.totalScore
            : typeof row.score === "number"
              ? row.score
              : 0,
        time: avgTime,
        memberId:
          typeof row.memberId === "string" && row.memberId.trim()
            ? row.memberId.trim()
            : key,
        avatarUrl: typeof row.avatarUrl === "string" ? row.avatarUrl : null,
      };
    })
  );
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
  const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0);
  /** memberId → RTDB users/ ile tamamlanan avatar (eski leaderboard satırları için). */
  const [avatarByMemberId, setAvatarByMemberId] = useState<Record<string, string>>({});
  const scoreSavedRef = useRef(false);

  useEffect(() => {
    const isEscaped = getStoredEscaped(slug) === true;
    setEscaped(isEscaped);
    if (!isEscaped) {
      router.replace(`/game/${slug}/hub`);
      return;
    }
    const playerKey = getPlayerKeyForSlug(slug);
    const stored = getCompletedGameResult(playerKey, slug);
    setFinalResult(stored ?? "missing");
  }, [slug, router]);

  useEffect(() => {
    if (finalResult === null || finalResult === "missing" || scoreSavedRef.current) return;
    scoreSavedRef.current = true;
    (async () => {
      try {
        console.log("RESULT memberId:", finalResult.memberId ?? null);
        await saveScore(
          finalResult.playerName,
          finalResult.slug,
          finalResult.score,
          finalResult.completionTime,
          finalResult.mistakes,
          finalResult.memberId ?? null,
          finalResult.avatarUrl ?? null
        );
        setLeaderboardRefreshKey((k) => k + 1);
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
  }, [escaped, leaderboardFilter, leaderboardRefreshKey]);

  useEffect(() => {
    if (!leaderboard?.length) return;
    let cancelled = false;
    const need = leaderboard.filter((e) => !e.avatarUrl?.trim() && e.memberId?.trim());
    if (need.length === 0) return;
    void (async () => {
      const pairs = await Promise.all(
        need.map(async (e) => {
          const id = e.memberId!.trim();
          const url = await fetchUserAvatarFromRtdb(id);
          return [id, url] as const;
        })
      );
      if (cancelled) return;
      setAvatarByMemberId((prev) => {
        const next = { ...prev };
        for (const [id, url] of pairs) {
          if (url) next[id] = url;
        }
        return next;
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [leaderboard]);

  useEffect(() => {
    if (finalResult === null || finalResult === "missing") return;
    const mid = finalResult.memberId?.trim();
    if (!mid || finalResult.avatarUrl?.trim()) return;
    let cancelled = false;
    void (async () => {
      const url = await fetchUserAvatarFromRtdb(mid);
      if (cancelled || !url) return;
      setAvatarByMemberId((prev) => {
        if (prev[mid]) return prev;
        return { ...prev, [mid]: url };
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [finalResult]);

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

  const activePlayerAvatarSrc = activePlayerAvatarUrl(
    finalResult,
    leaderboard,
    avatarByMemberId
  );

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
              <p className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
                <img
                  src={safeAvatarImgSrc(activePlayerAvatarSrc)}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-full border border-amber-500/45 object-cover"
                  loading="lazy"
                />
                <span>
                  Dedektif:{" "}
                  <span className="font-medium text-zinc-200">{finalResult.playerName}</span>
                </span>
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
                        key={(entry.memberId ?? entry.name) + i}
                        className="flex items-center justify-between rounded-lg bg-zinc-800/60 px-4 py-2.5 text-left"
                      >
                        <span className="flex items-center gap-2 font-medium text-zinc-200">
                          <img
                            src={safeAvatarImgSrc(leaderboardEntryAvatarUrl(entry, avatarByMemberId))}
                            alt=""
                            className="h-8 w-8 shrink-0 rounded-full border border-amber-500/45 object-cover"
                            loading="lazy"
                          />
                          {i + 1}. {entry.name}
                        </span>
                        <span className="tabular-nums text-amber-400/90">
                          {entry.score} · {entry.time === null ? "—" : formatTime(entry.time)}
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
