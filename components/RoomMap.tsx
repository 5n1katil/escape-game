"use client";

import { getStoredMaxSolvedRoomIndex } from "@/lib/gameStorage";
import type { Room } from "@/data/rooms";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RoomMapProps {
  slug: string;
  currentRoomIndex: number;
  rooms: readonly Room[];
}

type RoomState = "locked" | "current" | "solved" | "available";

function getRoomState(
  index: number,
  currentIndex: number,
  maxSolved: number
): RoomState {
  if (index === currentIndex) return "current";
  if (index <= maxSolved) return "solved";
  if (index === maxSolved + 1) return "available";
  return "locked";
}

export default function RoomMap({
  slug,
  currentRoomIndex,
  rooms,
}: RoomMapProps) {
  const [maxSolved, setMaxSolved] = useState(-1);
  const [mounted, setMounted] = useState(false);

  const roomIds = rooms.map((r) => r.id);

  useEffect(() => {
    setMaxSolved(getStoredMaxSolvedRoomIndex(slug, roomIds));
    setMounted(true);
  }, [slug, currentRoomIndex]);

  useEffect(() => {
    function onRoomSolved(e: CustomEvent<{ slug: string }>) {
      if (e.detail.slug === slug) {
        setMaxSolved(getStoredMaxSolvedRoomIndex(slug, roomIds));
      }
    }
    window.addEventListener(
      "escape-game-room-solved",
      onRoomSolved as EventListener
    );
    return () =>
      window.removeEventListener(
        "escape-game-room-solved",
        onRoomSolved as EventListener
      );
  }, [slug, rooms]);

  if (!mounted) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center rounded-xl border border-zinc-800/50 bg-zinc-900/40 md:w-48">
        <div className="h-6 w-6 animate-pulse rounded bg-zinc-700" />
      </div>
    );
  }

  return (
    <aside
      className="flex flex-col rounded-xl border border-zinc-800/50 bg-zinc-900/40 px-4 py-4"
      aria-label="Oda haritası"
    >
      <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-amber-500/90">
        Harita
      </h3>

      <nav className="flex flex-col gap-0" role="list">
        {rooms.map((room, index) => {
          const state = getRoomState(index, currentRoomIndex, maxSolved);
          const isUnlocked =
            state === "current" || state === "solved" || state === "available";

          const content = (
            <span className="flex flex-col items-center gap-0.5">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 text-lg transition-colors group-hover:border-emerald-500/60 md:h-11 md:w-11 ${
                  state === "locked"
                    ? "cursor-not-allowed border-zinc-700 bg-zinc-800/50 text-zinc-600 opacity-60"
                    : state === "current"
                      ? "border-amber-500 bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/40"
                      : state === "solved"
                        ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-400 group-hover:bg-emerald-500/20"
                        : "border-amber-500/60 bg-amber-950/30 text-amber-400/90 group-hover:bg-amber-500/20"
                }`}
                title={
                  state === "locked"
                    ? "Kilitli"
                    : state === "current"
                      ? "Mevcut oda"
                      : state === "solved"
                        ? "Çözüldü"
                        : "Sonraki oda"
                }
              >
                {state === "locked" ? "🔒" : state === "solved" ? "✓" : index + 1}
              </span>
              <span
                className={`max-w-[88px] truncate text-xs font-medium md:max-w-[100px] md:text-center ${
                  state === "locked"
                    ? "text-zinc-500"
                    : "text-zinc-400 group-hover:text-white"
                }`}
                title={room.title}
              >
                {room.title}
              </span>
            </span>
          );

          return (
            <div key={room.id} className="flex flex-col items-center">
              {isUnlocked ? (
                <Link
                  href={`/game/${slug}/room/${room.id}`}
                  className={`group flex w-full min-h-[48px] cursor-pointer touch-manipulation flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-2 transition-all duration-200 hover:bg-zinc-800/60 hover:scale-105 active:scale-100 ${
                    state === "current"
                      ? "bg-amber-500/10 ring-1 ring-amber-500/30"
                      : "hover:ring-1 hover:ring-emerald-500/40"
                  }`}
                  aria-current={state === "current" ? "location" : undefined}
                  aria-label={
                    state === "current"
                      ? `${room.title} (mevcut oda)`
                      : state === "solved"
                        ? `${room.title} (çözüldü) - tıklayarak git`
                        : `${room.title} (sonraki oda) - tıklayarak git`
                  }
                >
                  {content}
                </Link>
              ) : (
                <div
                  className="flex cursor-not-allowed touch-none flex-col items-center gap-0.5 px-2 py-2"
                  role="img"
                  aria-label={`${room.title} (kilitli)`}
                >
                  {content}
                </div>
              )}

              {index < rooms.length - 1 && (
                <div
                  className={`my-0.5 h-4 w-0.5 md:h-6 ${
                    index <= maxSolved ? "bg-emerald-600/40" : "bg-zinc-700/50"
                  }`}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
