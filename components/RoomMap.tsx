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
      aria-label="Oda ilerleme durumu"
    >
      <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-amber-500/90">
        İlerleme
      </h3>

      <div className="flex flex-col gap-0" role="list" aria-label="Oda durumları (navigasyon haritadan yapılır)">
        {rooms.map((room, index) => {
          const state = getRoomState(index, currentRoomIndex, maxSolved);

          const content = (
            <span className="flex flex-col items-center gap-0.5">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 text-lg md:h-11 md:w-11 ${
                  state === "locked"
                    ? "cursor-default border-zinc-700 bg-zinc-800/50 text-zinc-600 opacity-60"
                    : state === "current"
                      ? "border-amber-500 bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/40"
                      : state === "solved"
                        ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-400"
                        : "border-amber-500/60 bg-amber-950/30 text-amber-400/90"
                }`}
                title={
                  state === "locked"
                    ? "Kilitli"
                    : state === "current"
                      ? "Mevcut oda"
                      : state === "solved"
                        ? "Çözüldü"
                        : "Açık"
                }
              >
                {state === "locked" ? "🔒" : state === "solved" ? "✓" : index + 1}
              </span>
              <span
                className={`max-w-[88px] truncate text-xs font-medium md:max-w-[100px] md:text-center ${
                  state === "locked" ? "text-zinc-500" : "text-zinc-400"
                }`}
                title={room.title}
              >
                {room.title}
              </span>
            </span>
          );

          return (
            <div key={room.id} className="flex flex-col items-center">
              <div
                className={`flex w-full flex-col items-center gap-0.5 px-2 py-2 ${
                  state === "current" ? "bg-amber-500/10 ring-1 ring-amber-500/30 rounded-lg" : ""
                }`}
                role="listitem"
                aria-label={`${room.title}: ${state === "locked" ? "Kilitli" : state === "solved" ? "Çözüldü" : state === "current" ? "Mevcut oda" : "Açık"}`}
              >
                {content}
              </div>

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
      </div>

      <Link
        href={`/game/${slug}/hub`}
        className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-lg border border-amber-700/50 bg-amber-950/30 px-3 py-2 text-center text-sm font-medium text-amber-200/90 transition-colors hover:bg-amber-900/40 hover:text-amber-100"
      >
        Ana Ekrana Dön
      </Link>
    </aside>
  );
}
