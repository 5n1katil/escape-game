"use client";

import { getStoredRemainingTime } from "@/lib/gameStorage";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  slug: string;
  initialMinutes: number;
  ariaLabelTemplate?: string;
  /** Küçük, kutu içi yatay düzen (hub lobi vb.). */
  compact?: boolean;
  /**
   * Oda ekranı: mistik / taktik gösterge paneli (sabit sağ sütun).
   * `label` ile üst başlık (örn. “Zaman sayacı”).
   */
  variant?: "default" | "compact" | "tactical";
  /** variant="tactical" iken görünen üst etiket (örn. “Kalan zaman”) */
  label?: string;
}

export default function CountdownTimer({
  slug,
  initialMinutes,
  ariaLabelTemplate = "Time remaining: {minutes} minutes and {seconds} seconds",
  compact = false,
  variant,
  label,
}: CountdownTimerProps) {
  const effectiveVariant = variant ?? (compact ? "compact" : "default");
  const defaultSeconds = initialMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(defaultSeconds);

  useEffect(() => {
    const stored = getStoredRemainingTime(slug);
    if (stored !== null && Number.isFinite(stored)) {
      setSecondsLeft(stored);
    }
  }, [slug]);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getStoredRemainingTime(slug);
      setSecondsLeft(remaining ?? 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [slug]);

  const minutes = Math.floor(Math.max(0, secondsLeft) / 60);
  const seconds = Math.max(0, secondsLeft) % 60;
  const ariaLabel = ariaLabelTemplate
    .replace("{minutes}", String(minutes))
    .replace("{seconds}", String(seconds));

  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  if (effectiveVariant === "compact") {
    return (
      <span
        className="font-mono text-2xl font-bold tabular-nums text-white drop-shadow-md sm:text-3xl"
        aria-live="polite"
        aria-label={ariaLabel}
      >
        {timeStr}
      </span>
    );
  }

  if (effectiveVariant === "tactical") {
    return (
      <div
        className="tactical-hud-pulse relative overflow-hidden rounded-xl border-2 border-amber-500/55 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black px-3 py-4 sm:px-4 sm:py-5"
        aria-live="polite"
        aria-label={ariaLabel}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[10px] bg-[linear-gradient(180deg,rgba(251,191,36,0.06)_0%,transparent_42%,rgba(0,0,0,0.4)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent sm:inset-x-5"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-amber-400/25 ring-inset"
          aria-hidden
        />
        {label ? (
          <p className="relative mb-3 text-center text-xs font-extrabold uppercase leading-tight tracking-[0.2em] text-amber-300 sm:mb-3.5 sm:text-sm sm:tracking-[0.24em]">
            {label}
          </p>
        ) : null}
        <div className="relative flex items-center justify-center py-0.5">
          <span
            className="font-mono text-[2.65rem] font-bold leading-none tabular-nums tracking-[0.08em] text-amber-50 sm:text-[3.1rem] md:text-[3.25rem]"
            style={{
              textShadow:
                "0 0 22px rgba(251, 191, 36, 0.55), 0 0 48px rgba(245, 158, 11, 0.28), 0 2px 0 rgba(0,0,0,0.85)",
            }}
          >
            {timeStr}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="font-mono text-5xl font-bold tabular-nums text-white drop-shadow-lg sm:text-6xl md:text-7xl lg:text-8xl"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      {timeStr}
    </div>
  );
}
