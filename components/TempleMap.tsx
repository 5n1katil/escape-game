"use client";

import type { Room } from "@/data/rooms";
import {
  getPlayerSession,
  getStoredMaxSolvedRoomIndex,
} from "@/lib/gameStorage";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

/** Tapınak haritası (public/images/temple-map.jpg — oyun ile senkron). */
export const TEMPLE_MAP_IMAGE_PATH = "/images/temple-map.jpg";

/** Harita üzerinde oda alanları (yüzde: tüm görüntü koordinat sistemi). */
export const TEMPLE_MAP_SEGMENTS: {
  id: number;
  top: number;
  left: number;
  width: number;
  height: number;
}[] = [
  { id: 1, top: 8, left: 4, width: 26, height: 40 },
  { id: 2, top: 8, left: 36, width: 26, height: 40 },
  { id: 3, top: 8, left: 69, width: 26, height: 40 },
  { id: 4, top: 55, left: 4, width: 26, height: 40 },
  { id: 5, top: 55, left: 36, width: 26, height: 40 },
  { id: 6, top: 55, left: 69, width: 26, height: 40 },
];

function MapLockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function segmentStyle(seg: (typeof TEMPLE_MAP_SEGMENTS)[0]) {
  return {
    top: `${seg.top}%`,
    left: `${seg.left}%`,
    width: `${seg.width}%`,
    height: `${seg.height}%`,
  };
}

export interface TempleMapProps {
  slug: string;
  rooms: readonly Room[];
  goToRoomLabel: string;
  /** cover: kutu dolu (lobi sağ / sabit yükseklik); contain: kesilmez, yüzdeler tam görüntüye göre */
  imageFit: "cover" | "contain";
  className?: string;
  /** contain modunda img için ek sınıf (örn. max yükseklik) */
  containImgClassName?: string;
}

/**
 * Oturum durumuna göre tapınak haritası + kilitli/açık oda bölgeleri.
 * Kilit / navigasyon mantığı Hub ile aynı kaynaklardan okunur (localStorage).
 */
export default function TempleMap({
  slug,
  rooms,
  goToRoomLabel,
  imageFit,
  className = "",
  containImgClassName = "max-h-[min(72vh,560px)]",
}: TempleMapProps) {
  const [unlockedIds, setUnlockedIds] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);
  const [mapError, setMapError] = useState(false);

  const roomIds = rooms.map((r) => r.id);

  const refreshSession = useCallback(() => {
    const session = getPlayerSession(slug);
    if (session) {
      setUnlockedIds(session.unlockedRoomIds ?? []);
    }
  }, [slug]);

  useEffect(() => {
    refreshSession();
    setMounted(true);
  }, [refreshSession]);

  useEffect(() => {
    function onSolved() {
      refreshSession();
    }
    window.addEventListener("escape-game-room-solved", onSolved as EventListener);
    return () =>
      window.removeEventListener("escape-game-room-solved", onSolved as EventListener);
  }, [refreshSession]);

  if (!mounted) {
    return (
      <div
        className={`flex w-full items-center justify-center bg-zinc-900/80 ${
          imageFit === "contain" ? "min-h-[180px] rounded-lg" : "min-h-[200px]"
        } ${className}`}
      >
        <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-700" />
      </div>
    );
  }

  const maxSolved = getStoredMaxSolvedRoomIndex(slug, roomIds);
  const activeRoomId = roomIds[maxSolved + 1] ?? null;

  const lockedOverlayClass =
    "pointer-events-none absolute flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-md border-2 border-purple-400/65 bg-black/48 ring-1 ring-amber-400/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.15)] backdrop-blur-[2px] sm:gap-1";

  const lockedIconClass =
    "h-8 w-8 shrink-0 text-amber-100 drop-shadow-[0_0_10px_rgba(251,191,36,0.65)] sm:h-9 sm:w-9";

  const lockedNumClass =
    "text-sm font-extrabold tabular-nums text-amber-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] sm:text-base";

  const openBaseClass =
    "map-room-open absolute flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border-2 border-amber-300/95 bg-black/25 text-2xl font-black tabular-nums text-white touch-manipulation transition-transform duration-150 outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 sm:text-3xl";

  const openActiveExtra =
    "ring-2 ring-amber-300 ring-offset-2 ring-offset-zinc-950/80 z-[1]";

  if (mapError) {
    return (
      <div
        className={`flex w-full items-center justify-center bg-zinc-900/60 text-5xl text-zinc-600 ${
          imageFit === "contain" ? "min-h-[200px] rounded-lg" : "min-h-[200px]"
        } ${className}`}
        aria-hidden
      >
        🗺️
      </div>
    );
  }

  const segments = TEMPLE_MAP_SEGMENTS.map((seg) => {
    const roomId = seg.id;
    const room = rooms.find((r) => r.id === roomId);
    const unlocked = unlockedIds.includes(roomId);
    const roomIndex = rooms.findIndex((r) => r.id === roomId);
    const solved = roomIndex >= 0 && roomIndex <= maxSolved;
    const active = unlocked && !solved && roomId === activeRoomId;
    const style = segmentStyle(seg);

    if (!unlocked || !room) {
      return (
        <div
          key={roomId}
          className={lockedOverlayClass}
          style={style}
          title="Kilitli"
          aria-hidden
        >
          <MapLockIcon className={lockedIconClass} />
          <span className={lockedNumClass}>{roomId}</span>
        </div>
      );
    }

    return (
      <Link
        key={roomId}
        href={`/game/${slug}/room/${roomId}`}
        className={`${openBaseClass} ${
          solved ? "border-emerald-500/75 map-room-solved-pulse" : "map-room-open-pulse"
        } ${active ? openActiveExtra : ""} active:scale-[0.98]`}
        style={style}
        aria-label={`${room.title} - ${goToRoomLabel}`}
        title={room.title}
      >
        {roomId}
      </Link>
    );
  });

  if (imageFit === "contain") {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-amber-900/35 ${className}`}
        role="img"
        aria-label="Tapınak haritası - odalara tıklayarak gidebilirsiniz"
      >
        <img
          src={TEMPLE_MAP_IMAGE_PATH}
          alt=""
          className={`relative z-0 mx-auto block h-auto w-full object-contain object-center ${containImgClassName}`}
          onError={() => setMapError(true)}
        />
        <div className="pointer-events-none absolute inset-0 z-10 [&>a]:pointer-events-auto [&>div]:pointer-events-none">
          {segments}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative z-0 h-full min-h-[200px] w-full overflow-hidden bg-zinc-900 ${className}`}
      role="img"
      aria-label="Tapınak haritası - odalara tıklayarak gidebilirsiniz"
    >
      <img
        src={TEMPLE_MAP_IMAGE_PATH}
        alt=""
        className="absolute inset-0 z-0 h-full w-full object-cover"
        onError={() => setMapError(true)}
      />
      <div className="absolute inset-0 z-10">{segments}</div>
    </div>
  );
}
