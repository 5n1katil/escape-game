"use client";

import { saveScore } from "@/lib/firebase";
import { calculateScore, getSession } from "@/lib/gameSession";
import { getStoredEscaped } from "@/lib/gameStorage";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Translations } from "@/lib/i18n";

const LEADERBOARD_FETCH_URL =
  "https://n1dedektif-leaderboard-default-rtdb.europe-west1.firebasedatabase.app/leaderboards/escape_room/players.json";

export interface LeaderboardEntry {
  name: string;
  score: number;
  time: number;
}

interface ResultClientProps {
  slug: string;
  gameTitle: string;
  wixUrl: string;
  tResult: Translations["result"];
  tRoomResult: Translations["room"]["result"];
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

async function fetchTopLeaderboard(limit: number): Promise<LeaderboardEntry[]> {
  const res = await fetch(LEADERBOARD_FETCH_URL);
  if (!res.ok) return [];
  const data: Record<string, { score?: number; time?: number; mistakes?: number }> | null = await res.json();
  if (!data || typeof data !== "object") return [];
  const entries: LeaderboardEntry[] = Object.entries(data).map(([name, row]) => ({
    name: name.replace(/_/g, " ").trim() || "—",
    score: typeof row?.score === "number" ? row.score : 0,
    time: typeof row?.time === "number" ? row.time : 0,
  }));
  entries.sort((a, b) => b.score - a.score || a.time - b.time);
  return entries.slice(0, limit);
}

export default function ResultClient({
  slug,
  gameTitle,
  wixUrl,
  tResult,
  tRoomResult,
}: ResultClientProps) {
  const router = useRouter();
  const [escaped, setEscaped] = useState<boolean | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[] | null>(null);
  const [leaderboardError, setLeaderboardError] = useState(false);
  const scoreSavedRef = useRef(false);

  useEffect(() => {
    const isEscaped = getStoredEscaped(slug) === true;
    setEscaped(isEscaped);
    if (!isEscaped) {
      router.replace(`/game/${slug}/hub`);
    }
  }, [slug, router]);

  useEffect(() => {
    if (!escaped || scoreSavedRef.current) return;
    const session = getSession(slug);
    if (!session) return;
    const scoreResult = calculateScore(session);
    scoreSavedRef.current = true;
    (async () => {
      try {
        await saveScore(
          "testDedektifWeb",
          scoreResult.finalScore,
          scoreResult.remainingTime,
          scoreResult.totalAttempts
        );
      } catch {
        // ignore
      }
    })();
  }, [escaped, slug]);

  useEffect(() => {
    if (!escaped) return;
    let cancelled = false;
    (async () => {
      try {
        const top = await fetchTopLeaderboard(5);
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
  }, [escaped]);

  if (escaped === null || !escaped) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  const session = getSession(slug);
  const scoreResult = session ? calculateScore(session) : null;

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 sm:py-16">
      <main className="mx-auto max-w-xl space-y-6 rounded-xl border border-amber-500/30 bg-zinc-900/50 px-5 py-8 shadow-xl sm:space-y-8 sm:px-8 sm:py-10">
        <header className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-amber-500/90">{gameTitle}</p>
          <h1 className="mt-2 text-2xl font-bold text-amber-400 sm:text-3xl md:text-4xl">
            {tResult.endTitle}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-zinc-300 sm:text-lg">
            {tResult.endStory}
          </p>
        </header>

        {scoreResult && (
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
                <dd className="text-lg font-bold text-white tabular-nums">{scoreResult.finalScore}</dd>
              </div>
              <div className="flex justify-between rounded-lg bg-zinc-900/50 px-4 py-2 sm:flex-col sm:gap-0">
                <dt className="text-sm text-zinc-400">{tRoomResult.remainingTime}</dt>
                <dd className="text-lg font-medium text-zinc-200 tabular-nums">
                  {formatTime(scoreResult.remainingTime)}
                </dd>
              </div>
              <div className="flex justify-between rounded-lg bg-zinc-900/50 px-4 py-2 sm:flex-col sm:gap-0">
                <dt className="text-sm text-zinc-400">{tRoomResult.totalAttempts}</dt>
                <dd className="text-lg font-medium text-zinc-200 tabular-nums">{scoreResult.totalAttempts}</dd>
              </div>
              <div className="flex justify-between rounded-lg bg-zinc-900/50 px-4 py-2 sm:flex-col sm:gap-0">
                <dt className="text-sm text-zinc-400">{tRoomResult.firstTryCount}</dt>
                <dd className="text-lg font-medium text-zinc-200 tabular-nums">
                  {scoreResult.roomsSolvedFirstTry}
                </dd>
              </div>
            </dl>
          </section>
        )}

        <section
          className="rounded-xl border border-zinc-700/50 bg-zinc-900/40 px-4 py-5 sm:px-6"
          aria-label={tResult.leaderboardTitle}
        >
          <h2 className="text-center text-base font-semibold text-amber-500/90 sm:text-lg">
            {tResult.leaderboardTitle}
          </h2>
          {leaderboardError && (
            <p className="mt-4 text-center text-sm text-zinc-500">{tResult.leaderboardError}</p>
          )}
          {!leaderboardError && leaderboard === null && (
            <p className="mt-4 text-center text-sm text-zinc-500">{tResult.leaderboardLoading}</p>
          )}
          {!leaderboardError && leaderboard && leaderboard.length > 0 && (
            <ol className="mt-4 space-y-2">
              {leaderboard.map((entry, i) => (
                <li
                  key={entry.name + i}
                  className="flex items-center justify-between rounded-lg bg-zinc-800/60 px-4 py-2.5 text-left"
                >
                  <span className="font-medium text-zinc-200">
                    {i + 1}. {entry.name}
                  </span>
                  <span className="tabular-nums text-amber-400/90">
                    {entry.score} · {formatTime(entry.time)}
                  </span>
                </li>
              ))}
            </ol>
          )}
          {!leaderboardError && leaderboard && leaderboard.length === 0 && (
            <p className="mt-4 text-center text-sm text-zinc-500">{tResult.leaderboardError}</p>
          )}
        </section>

        <div className="flex justify-center pt-2">
          <a
            href={wixUrl}
            className="inline-flex min-h-[52px] min-w-[200px] items-center justify-center rounded-xl bg-amber-600 px-8 py-3.5 text-lg font-semibold text-white transition-colors hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            {tResult.backToWix}
          </a>
        </div>
      </main>
    </div>
  );
}
