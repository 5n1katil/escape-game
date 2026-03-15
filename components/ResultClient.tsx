"use client";

import { saveScore } from "@/lib/firebase";
import { calculateScore, getSession } from "@/lib/gameSession";
import { getStoredEscaped } from "@/lib/gameStorage";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Translations } from "@/lib/i18n";

interface ResultClientProps {
  slug: string;
  gameTitle: string;
  wixUrl: string;
  tResult: Translations["result"];
  tRoomResult: Translations["room"]["result"];
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
        await saveScore("testDedektifWeb", scoreResult.finalScore, scoreResult.remainingTime, scoreResult.totalAttempts);
      } catch {
        // ignore
      }
    })();
  }, [escaped, slug]);

  if (escaped === null || !escaped) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  const session = getSession(slug);
  const scoreResult = session ? calculateScore(session) : null;

  function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-16">
      <main className="mx-auto max-w-xl space-y-8 rounded-lg border border-amber-500/30 bg-amber-950/20 px-6 py-10 text-center sm:px-8 sm:py-12">
        <h1 className="text-2xl font-bold text-amber-400 sm:text-3xl md:text-4xl">
          {tResult.endTitle}
        </h1>
        <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
          {tResult.endStory}
        </p>
        {scoreResult && (
          <div
            className="space-y-3 rounded-lg border border-amber-500/20 bg-zinc-900/40 px-4 py-4 text-left"
            role="region"
            aria-label={tRoomResult.title}
          >
            <h2 className="text-center text-lg font-semibold text-amber-300">
              {tRoomResult.title}
            </h2>
            <dl className="grid gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-zinc-400">{tRoomResult.finalScore}</dt>
                <dd className="text-lg font-bold text-white tabular-nums">{scoreResult.finalScore}</dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-400">{tRoomResult.remainingTime}</dt>
                <dd className="text-lg font-medium text-zinc-200 tabular-nums">
                  {formatTime(scoreResult.remainingTime)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-400">{tRoomResult.totalAttempts}</dt>
                <dd className="text-lg font-medium text-zinc-200 tabular-nums">{scoreResult.totalAttempts}</dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-400">{tRoomResult.firstTryCount}</dt>
                <dd className="text-lg font-medium text-zinc-200 tabular-nums">{scoreResult.roomsSolvedFirstTry}</dd>
              </div>
            </dl>
          </div>
        )}
        <a
          href={wixUrl}
          className="inline-flex min-h-[56px] min-w-[200px] items-center justify-center rounded-xl bg-amber-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-amber-500"
        >
          {tResult.backToWix}
        </a>
      </main>
    </div>
  );
}
