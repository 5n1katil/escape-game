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
  /** variant="tactical" iken görünen üst etiket */
  label?: string;
  /** variant="tactical" alt satır (ince yazı) */
  tacticalFooter?: string;
}

export default function CountdownTimer({
  slug,
  initialMinutes,
  ariaLabelTemplate = "Time remaining: {minutes} minutes and {seconds} seconds",
  compact = false,
  variant,
  label,
  tacticalFooter,
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
        className="tactical-hud-pulse relative overflow-hidden rounded-xl border-2 border-amber-600/50 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 px-3 py-3 sm:px-4 sm:py-4"
        aria-live="polite"
        aria-label={ariaLabel}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[10px] bg-[linear-gradient(180deg,rgba(251,191,36,0.04)_0%,transparent_45%,rgba(0,0,0,0.35)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-amber-500/20 ring-inset"
          aria-hidden
        />
        {label ? (
          <p className="relative mb-2 text-center text-[10px] font-bold uppercase tracking-[0.28em] text-amber-400/95 sm:text-[11px]">
            {label}
          </p>
        ) : null}
        <div className="relative flex flex-col items-center justify-center gap-0.5">
          <span
            className="font-mono text-[2.35rem] font-bold leading-none tabular-nums tracking-[0.06em] text-amber-100 sm:text-[2.75rem] md:text-5xl"
            style={{
              textShadow:
                "0 0 18px rgba(251, 191, 36, 0.45), 0 0 36px rgba(245, 158, 11, 0.2), 0 1px 0 rgba(0,0,0,0.8)",
            }}
          >
            {timeStr}
          </span>
          {tacticalFooter ? (
            <span className="text-[10px] font-medium uppercase tracking-widest text-amber-600/80 sm:text-xs">
              {tacticalFooter}
            </span>
          ) : null}
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
