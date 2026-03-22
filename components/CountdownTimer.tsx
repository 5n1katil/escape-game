"use client";

import { useGameUi } from "@/components/GameVisualThemeProvider";
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
  const { themeId, ui } = useGameUi();
  const cd = ui.countdown;
  const mobileGlow =
    themeId === "cyber" ? "0 0 20px rgba(34, 211, 238, 0.35)" : "0 0 20px rgba(245, 158, 11, 0.35)";
  const tacticalGlow =
    themeId === "cyber" ? "0 0 28px rgba(34, 211, 238, 0.4)" : "0 0 28px rgba(245, 158, 11, 0.4)";
  const tacticalWideGlow =
    themeId === "cyber" ? "0 0 22px rgba(34, 211, 238, 0.35)" : "0 0 22px rgba(245, 158, 11, 0.35)";
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
        className={`flex w-full min-w-0 items-center justify-between gap-3 ${cd.mobileBar}`}
        aria-live="polite"
        aria-label={ariaLabel}
      >
        {label ? (
          <span className={cd.mobileLabel}>
            {label}
          </span>
        ) : (
          <span className="sr-only">{ariaLabel}</span>
        )}
        <span
          className={cd.mobileTime}
          style={{ textShadow: mobileGlow }}
        >
          {timeStr}
        </span>
      </div>
    );
  }

  if (effectiveVariant === "tactical") {
    return (
      <div
        className={cd.compactBox}
        aria-live="polite"
        aria-label={ariaLabel}
      >
        {label ? (
          <p className={cd.compactLabel}>
            {label}
          </p>
        ) : null}
        <p
          className={`${cd.compactTime} ${label ? "mt-2 sm:mt-3" : ""}`}
          style={{ textShadow: tacticalGlow }}
        >
          {timeStr}
        </p>
      </div>
    );
  }

  if (effectiveVariant === "tacticalWide") {
    return (
      <div
        className={cd.hubBox}
        aria-live="polite"
        aria-label={ariaLabel}
      >
        {label ? (
          <p className={cd.hubLabel}>
            {label}
          </p>
        ) : null}
        <p
          className={`${cd.hubTime} ${label ? "mt-1 sm:mt-1.5" : ""}`}
          style={{ textShadow: tacticalWideGlow }}
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
