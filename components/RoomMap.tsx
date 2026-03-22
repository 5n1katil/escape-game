"use client";

import { getStoredMaxSolvedRoomIndex } from "@/lib/gameStorage";
import type { Room } from "@/data/rooms";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RoomMapProps {
  slug: string;
  currentRoomIndex: number;
  rooms: readonly Room[];
  /** `slim`: ince sağ sütun (oda ekranı taktik paneli). */
  density?: "default" | "slim";
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
  density = "default",
}: RoomMapProps) {
  const slim = density === "slim";
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
      <div
        className={`flex w-full items-center justify-center rounded-xl border border-zinc-800/50 bg-zinc-900/40 ${
          slim ? "h-[160px]" : "h-[200px] md:min-h-[240px]"
        }`}
      >
        <div className="h-6 w-6 animate-pulse rounded bg-zinc-700" />
      </div>
    );
  }

  return (
    <aside
      className={`flex flex-col rounded-xl border border-zinc-800/60 bg-zinc-900/50 ${
        slim ? "px-2.5 py-3 ring-1 ring-amber-950/40" : "px-4 py-4"
      }`}
      aria-label="Oda ilerleme durumu"
    >
      <h3
        className={`text-center font-semibold uppercase tracking-wider text-amber-500/90 ${
          slim ? "mb-2 text-[10px] tracking-[0.2em]" : "mb-4 text-sm"
        }`}
      >
        İlerleme
      </h3>

      <div className="flex flex-col gap-0" role="list" aria-label="Oda durumları">
        {rooms.map((room, index) => {
          const state = getRoomState(index, currentRoomIndex, maxSolved);
          const canNavigate = state !== "locked";
          const roomHref = `/game/${slug}/room/${room.id}`;

          const content = (
            <span className="flex flex-col items-center gap-0.5">
              <span
                className={`flex shrink-0 items-center justify-center rounded-lg border-2 ${
                  slim
                    ? "h-8 w-8 text-sm md:h-8 md:w-8"
                    : "h-10 w-10 text-lg md:h-11 md:w-11"
                } ${
                  state === "locked"
                    ? "cursor-default border-zinc-700 bg-zinc-800/50 text-zinc-600 opacity-60"
                    : state === "current"
                      ? "border-amber-500 bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/40"
                      : state === "solved"
                        ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-400"
                        : "border-amber-500/60 bg-amber-950/30 text-amber-400/90"
                } ${canNavigate ? "cursor-pointer" : ""}`}
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
                className={`truncate font-medium ${
                  slim
                    ? "max-w-[4.25rem] text-center text-[9px] leading-tight md:max-w-[4.5rem]"
                    : "max-w-[88px] text-xs md:max-w-[100px] md:text-center"
                } ${state === "locked" ? "text-zinc-500" : "text-zinc-400"}`}
                title={room.title}
              >
                {room.title}
              </span>
            </span>
          );

          const itemClasses = `flex w-full flex-col items-center gap-0.5 ${
            slim ? "px-1 py-1.5" : "px-2 py-2"
          } ${
            state === "current" ? "bg-amber-500/10 ring-1 ring-amber-500/30 rounded-lg" : ""
          } ${canNavigate ? "transition-colors hover:bg-zinc-800/60 rounded-lg touch-manipulation" : ""}`;

          return (
            <div key={room.id} className="flex flex-col items-center">
              {canNavigate ? (
                <Link
                  href={roomHref}
                  className={itemClasses}
                  role="listitem"
                  aria-label={`${room.title}: ${state === "solved" ? "Çözüldü" : state === "current" ? "Mevcut oda" : "Açık"} - Odaya git`}
                >
                  {content}
                </Link>
              ) : (
                <div
                  className={itemClasses}
                  role="listitem"
                  aria-label={`${room.title}: Kilitli`}
                >
                  {content}
                </div>
              )}

              {index < rooms.length - 1 && (
                <div
                  className={`my-0.5 w-0.5 ${slim ? "h-3 md:h-3" : "h-4 md:h-6"} ${
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
        className={`mt-3 flex w-full items-center justify-center rounded-lg border border-amber-700/50 bg-amber-950/30 text-center font-medium text-amber-200/90 transition-colors hover:bg-amber-900/40 hover:text-amber-100 ${
          slim
            ? "min-h-[40px] px-2 py-2 text-[11px] leading-tight"
            : "mt-4 min-h-[44px] px-3 py-2 text-sm"
        }`}
      >
        Ana Ekrana Dön
      </Link>
    </aside>
  );
}
