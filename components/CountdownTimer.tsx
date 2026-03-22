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
        className="tactical-hud-pulse relative w-full min-w-0 overflow-visible rounded-xl border-2 border-amber-500/55 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black py-3 sm:py-4"
        aria-live="polite"
        aria-label={ariaLabel}
      >
        {/* Dekor katmanları ayrı: metin/glow kesilmesin */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[10px]" aria-hidden>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,191,36,0.06)_0%,transparent_42%,rgba(0,0,0,0.4)_100%)]" />
          <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent sm:inset-x-4" />
          <div className="absolute inset-0 rounded-xl ring-1 ring-amber-400/25 ring-inset" />
        </div>
        <div className="relative z-10 w-full min-w-0 px-2 sm:px-3">
          {label ? (
            <p className="mb-2 text-center text-[11px] font-extrabold uppercase leading-tight tracking-[0.14em] text-amber-300 sm:mb-2.5 sm:text-xs sm:tracking-[0.18em]">
              {label}
            </p>
          ) : null}
          <div className="flex w-full min-w-0 justify-center overflow-visible py-0.5">
            <span
              className="font-mono text-[clamp(1.65rem,4.2vw+0.6rem,2.35rem)] font-bold leading-none tabular-nums tracking-tight text-amber-50"
              style={{
                textShadow:
                  "0 0 18px rgba(251, 191, 36, 0.5), 0 0 40px rgba(245, 158, 11, 0.22), 0 2px 0 rgba(0,0,0,0.85)",
              }}
            >
              {timeStr}
            </span>
          </div>
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
