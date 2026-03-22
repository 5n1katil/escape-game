"use client";

import { useGameUi } from "@/components/GameVisualThemeProvider";
import type { Room } from "@/data/rooms";
import {
  getPlayerSession,
  getStoredMaxSolvedRoomIndex,
} from "@/lib/gameStorage";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

/** Varsayılan harita (Tapınak); oyunlar `mapImagePath` ile geçersiz kılar. */
export const TEMPLE_MAP_IMAGE_PATH =
  "/games/tapinagin-laneti/images/temple-map.jpg";

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
  /** Varsayılan: tapınak haritası */
  mapImageSrc?: string;
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
  mapImageSrc = TEMPLE_MAP_IMAGE_PATH,
}: TempleMapProps) {
  const { ui, themeId } = useGameUi();
  const tm = ui.templeMap;
  const openPulseClass =
    themeId === "cyber" ? "map-room-open-pulse-cyber" : "map-room-open-pulse";
  const solvedPulseClass =
    themeId === "cyber" ? "map-room-solved-pulse-cyber" : "map-room-solved-pulse";
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

  const lockedOverlayClass = tm.lockedOverlay;
  const lockedIconClass = tm.lockedIcon;
  const lockedNumClass = tm.lockedNum;
  const openBaseClass = tm.openBase;
  const openActiveExtra = tm.openActive;

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
          solved ? `border-emerald-500/75 ${solvedPulseClass}` : openPulseClass
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
        className={`relative w-full overflow-hidden rounded-lg bg-zinc-900 ring-1 ${tm.containRing} ${className}`}
        role="img"
        aria-label="Oyun haritası - odalara tıklayarak gidebilirsiniz"
      >
        <img
          src={mapImageSrc}
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
      aria-label="Oyun haritası - odalara tıklayarak gidebilirsiniz"
    >
      <img
        src={mapImageSrc}
        alt=""
        className="absolute inset-0 z-0 h-full w-full object-cover"
        onError={() => setMapError(true)}
      />
      <div className="absolute inset-0 z-10">{segments}</div>
    </div>
  );
}
