"use client";

import { getStoredRemainingTime } from "@/lib/gameStorage";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  slug: string;
  initialMinutes: number;
  ariaLabelTemplate?: string;
  /** Küçük, kutu içi yatay düzen (hub lobi vb.). */
  compact?: boolean;
  /** tactical: sağ panel; tacticalWide: geniş çerçeve, dikey biraz daha kompakt; mobileBar: mobil çubuk. */
  variant?: "default" | "compact" | "tactical" | "tacticalWide" | "mobileBar";
  /** tactical / mobileBar üst etiket */
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

  if (effectiveVariant === "mobileBar") {
    return (
      <div
        className="flex w-full min-w-0 items-center justify-between gap-3 border-b border-amber-500/40 bg-black/70 px-3 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-md sm:px-4"
        aria-live="polite"
        aria-label={ariaLabel}
      >
        {label ? (
          <span className="shrink-0 text-[10px] font-extrabold uppercase leading-tight tracking-[0.12em] text-amber-400 sm:text-xs sm:tracking-[0.16em]">
            {label}
          </span>
        ) : (
          <span className="sr-only">{ariaLabel}</span>
        )}
        <span
          className="font-mono text-3xl font-black tabular-nums tracking-tight text-amber-400 drop-shadow-[0_0_14px_rgba(251,191,36,0.55)] sm:text-4xl"
          style={{ textShadow: "0 0 20px rgba(245, 158, 11, 0.35)" }}
        >
          {timeStr}
        </span>
      </div>
    );
  }

  if (effectiveVariant === "tactical") {
    return (
      <div
        className="w-full shrink-0 rounded-xl border-2 border-amber-500/50 bg-black/60 px-3 py-4 shadow-[0_0_36px_rgba(245,158,11,0.18),inset_0_1px_0_rgba(251,191,36,0.08)] sm:px-4 sm:py-5"
        aria-live="polite"
        aria-label={ariaLabel}
      >
        {label ? (
          <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-400/95 sm:text-xs sm:tracking-[0.22em]">
            {label}
          </p>
        ) : null}
        <p
          className={`text-center font-mono text-5xl font-black tabular-nums tracking-tight text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] lg:text-6xl ${label ? "mt-2 sm:mt-3" : ""}`}
          style={{ textShadow: "0 0 28px rgba(245, 158, 11, 0.4)" }}
        >
          {timeStr}
        </p>
      </div>
    );
  }

  if (effectiveVariant === "tacticalWide") {
    return (
      <div
        className="w-full shrink-0 rounded-xl border-2 border-amber-500/45 bg-black/55 px-3 py-2.5 shadow-[0_0_28px_rgba(245,158,11,0.14),inset_0_1px_0_rgba(251,191,36,0.08)] sm:px-4 sm:py-3"
        aria-live="polite"
        aria-label={ariaLabel}
      >
        {label ? (
          <p className="text-center text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-400/95 sm:text-[11px] sm:tracking-[0.2em]">
            {label}
          </p>
        ) : null}
        <p
          className={`text-center font-mono text-4xl font-black tabular-nums tracking-tight text-amber-400 drop-shadow-[0_0_14px_rgba(251,191,36,0.55)] sm:text-5xl lg:text-[2.75rem] ${label ? "mt-1 sm:mt-1.5" : ""}`}
          style={{ textShadow: "0 0 22px rgba(245, 158, 11, 0.35)" }}
        >
          {timeStr}
        </p>
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
