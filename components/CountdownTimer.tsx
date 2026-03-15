"use client";

import { getStoredRemainingTime } from "@/lib/gameStorage";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  slug: string;
  initialMinutes: number;
  ariaLabelTemplate?: string;
  /** Küçük, kutu içi yatay düzen (hub lobi vb.). */
  compact?: boolean;
}

export default function CountdownTimer({
  slug,
  initialMinutes,
  ariaLabelTemplate = "Time remaining: {minutes} minutes and {seconds} seconds",
  compact = false,
}: CountdownTimerProps) {
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

  if (compact) {
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
