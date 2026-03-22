"use client";

import { useGameUi } from "@/components/GameVisualThemeProvider";
import { getStoredMaxSolvedRoomIndex } from "@/lib/gameStorage";
import type { Room } from "@/data/rooms";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RoomMapProps {
  slug: string;
  currentRoomIndex: number;
  rooms: readonly Room[];
  /**
   * `slim`: dar dikey liste.
   * `sidebar`: oda ekranı — ikon + çok satırlı başlık, geniş sütun için.
   */
  density?: "default" | "slim" | "sidebar";
  /** Sağ taktik sütunda kalan yüksekliği doldur; taşma yok (scrollbar yok). */
  fillColumn?: boolean;
  /** Oda sayfası mobil: sayaç altında kompakt ilerleme şeridi (masaüstü aside ile ayrı instance). */
  compactStrip?: boolean;
  /** Geniş taktik çerçeve içinde: dış çift border kaldırılır, içerik ferahlar. */
  embeddedInFrame?: boolean;
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
  fillColumn = false,
  compactStrip = false,
  embeddedInFrame = false,
}: RoomMapProps) {
  const { ui } = useGameUi();
  const rm = ui.roomMap;
  const slim = density === "slim";
  const sidebar = density === "sidebar";
  const strip = sidebar && compactStrip;
  const fill = sidebar && fillColumn && !strip;
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
          strip ? "min-h-[120px]"
            : sidebar
              ? "min-h-[200px]"
              : slim
                ? "h-[160px]"
                : "h-[200px] md:min-h-[240px]"
        }`}
      >
        <div className="h-6 w-6 animate-pulse rounded bg-zinc-700" />
      </div>
    );
  }

  function cellClass(state: RoomState, canNavigate: boolean, compact: boolean) {
    const size = compact ? "h-9 w-9 text-base" : "h-10 w-10 text-lg md:h-11 md:w-11";
    return `flex shrink-0 items-center justify-center rounded-lg border-2 ${size} ${
      state === "locked"
        ? "cursor-default border-zinc-700 bg-zinc-800/50 text-zinc-600 opacity-60"
        : state === "current"
          ? rm.currentCell
          : state === "solved"
            ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-400"
            : rm.availableCell
    } ${canNavigate ? "cursor-pointer" : ""}`;
  }

  const hubLinkClass = `mt-4 flex w-full min-h-[44px] items-center justify-center rounded-lg border px-3 py-2.5 text-center text-sm font-medium transition-colors duration-200 ${rm.hubLink}`;

  if (sidebar) {
    const rowTitleClass = (state: RoomState) => {
      if (strip) {
        if (state === "current") {
          return `text-left text-sm font-bold leading-snug tracking-normal break-words line-clamp-2 ${rm.stripCurrentTitle}`;
        }
        if (state === "locked") {
          return "text-left text-xs font-medium leading-snug tracking-normal break-words line-clamp-2 text-zinc-500";
        }
        return "text-left text-xs font-semibold leading-snug tracking-normal break-words line-clamp-2 text-zinc-200";
      }
      if (fill) {
        const clamp = framed ? "line-clamp-3" : "line-clamp-2";
        if (state === "current") {
          return `text-left text-base font-bold leading-snug tracking-normal break-words ${clamp} ${rm.fillCurrentTitle}`;
        }
        if (state === "locked") {
          return `text-left text-sm font-medium leading-snug tracking-normal break-words ${clamp} text-zinc-500`;
        }
        return `text-left text-sm font-semibold leading-snug tracking-normal break-words ${clamp} text-zinc-200`;
      }
      return `text-left text-sm font-medium leading-snug tracking-normal break-words sm:text-[0.9375rem] ${
        state === "locked" ? "text-zinc-500" : "text-zinc-200"
      }`;
    };

    const framed = fill && embeddedInFrame;

    function rowShellClass(state: RoomState, canNavigate: boolean) {
      if (!framed && !strip) {
        return `flex w-full min-w-0 ${fill || strip ? "gap-2" : "gap-1 sm:gap-2"}`;
      }
      const base =
        "box-border flex w-full min-w-0 rounded-lg border border-transparent transition-all duration-200";
      if (!canNavigate) {
        return `${base} gap-2 hover:border-zinc-600/35 hover:bg-zinc-800/30 hover:shadow-[inset_0_0_0_1px_rgba(82,82,91,0.25)]`;
      }
      if (state === "current") {
        return `${base} gap-2 ${rm.rowHoverCurrent}`;
      }
      if (state === "solved") {
        return `${base} gap-2 hover:border-emerald-500/40 hover:bg-emerald-950/35 hover:shadow-[0_0_18px_rgba(16,185,129,0.14)]`;
      }
      return `${base} gap-2 ${rm.rowHoverAvailable}`;
    }

    return (
      <aside
        className={`flex flex-col rounded-xl ${
          framed
            ? `h-full min-h-0 min-w-0 flex-1 rounded-lg border ${rm.asideFramed} bg-zinc-900/40 box-border px-3 py-3 sm:px-4 sm:py-3.5`
            : `border border-zinc-800/60 bg-zinc-900/50 ring-1 ${rm.asideRing} ${
                fill
                  ? "h-full min-h-0 min-w-0 flex-1 overflow-hidden px-3 py-3 sm:px-4 sm:py-4"
                  : strip
                    ? "max-h-[min(42vh,320px)] min-h-0 w-full shrink-0 overflow-hidden px-2.5 py-2"
                    : "px-3 py-4 sm:px-4"
              }`
        }`}
        aria-label="Oda ilerleme durumu"
      >
        <h3
          className={`text-center font-semibold uppercase tracking-wider ${rm.progressTitle} ${
            fill
              ? "mb-2 shrink-0 text-xs tracking-[0.2em] sm:mb-2.5 sm:text-[0.8125rem]"
              : strip
                ? "mb-1.5 shrink-0 text-[10px] tracking-[0.18em]"
                : "mb-3 text-xs sm:mb-3 sm:text-sm"
          }`}
        >
          İlerleme
        </h3>

        <div
          className={`flex min-h-0 flex-col ${
            fill
              ? framed
                ? "flex-1 gap-2 overflow-visible py-0.5"
                : "flex-1 gap-2 overflow-hidden"
              : strip
                ? "flex-1 gap-1 overflow-y-auto overscroll-y-contain pr-0.5 [scrollbar-width:thin]"
                : "gap-0"
          }`}
          role="list"
          aria-label="Oda durumları"
        >
          {rooms.map((room, index) => {
            const state = getRoomState(index, currentRoomIndex, maxSolved);
            const canNavigate = state !== "locked";
            const roomHref = `/game/${slug}/room/${room.id}`;
            const tClass = rowTitleClass(state);
            const rowAria = `${room.title}: ${state === "solved" ? "Çözüldü" : state === "current" ? "Mevcut oda" : "Açık"} - Odaya git`;

            const currentRowFrame =
              canNavigate && state === "current"
                ? rm.currentRowFrame
                : "";

            const navigableRowExtras = canNavigate
              ? `items-start touch-manipulation outline-none ${rm.navigableFocus} min-h-[44px] py-0.5 ${currentRowFrame}`
              : "";

            const rowInner = (
              <>
                <div
                  className={`flex shrink-0 flex-col items-center ${fill ? (framed ? "w-11" : "w-10") : strip ? "w-8" : "w-11 sm:w-12"}`}
                >
                  <span
                    className={cellClass(state, false, !fill)}
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
                  {index < rooms.length - 1 && (
                    <div
                      className={`w-0.5 flex-1 ${
                        fill
                          ? "my-1 min-h-[10px]"
                          : strip
                            ? "my-0.5 min-h-[6px]"
                            : "my-1 min-h-[14px]"
                      } ${index <= maxSolved ? "bg-emerald-600/45" : "bg-zinc-700/55"}`}
                      aria-hidden
                    />
                  )}
                </div>
                <div
                  className={`min-w-0 flex-1 border-b border-zinc-800/40 pl-1 pr-2 ${
                    fill ? (framed ? "py-2.5 sm:py-3" : "py-2.5 sm:py-3") : strip ? "py-1.5" : "py-1.5 sm:py-2"
                  }`}
                >
                  {canNavigate ? (
                    <span className={`block min-w-0 transition-colors duration-200 ${tClass}`}>
                      {room.title}
                    </span>
                  ) : (
                    <span className={`block ${tClass}`} aria-label={`${room.title}: Kilitli`}>
                      {room.title}
                    </span>
                  )}
                </div>
              </>
            );

            if (canNavigate) {
              return (
                <Link
                  key={room.id}
                  href={roomHref}
                  role="listitem"
                  className={`${rowShellClass(state, canNavigate)} ${navigableRowExtras}`}
                  aria-label={rowAria}
                >
                  {rowInner}
                </Link>
              );
            }

            return (
              <div key={room.id} role="listitem" className={rowShellClass(state, canNavigate)}>
                {rowInner}
              </div>
            );
          })}
        </div>

        <Link
          href={`/game/${slug}/hub`}
          className={
            fill || strip
              ? `mt-3 flex w-full shrink-0 items-center justify-center rounded-lg px-3 py-2 text-center text-xs font-medium transition-all duration-200 sm:text-sm ${rm.hubLinkCompact}`
              : hubLinkClass
          }
        >
          Ana Ekrana Dön
        </Link>
      </aside>
    );
  }

  return (
    <aside
      className={`flex flex-col rounded-xl border border-zinc-800/60 bg-zinc-900/50 ${
        slim ? `px-2.5 py-3 ring-1 ${rm.slimAsideRing}` : "px-4 py-4"
      }`}
      aria-label="Oda ilerleme durumu"
    >
      <h3
        className={`text-center font-semibold uppercase tracking-wider ${rm.progressTitle} ${
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
                      ? rm.defaultCurrentCell
                      : state === "solved"
                        ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-400"
                        : rm.defaultAvailableCell
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
            state === "current" ? `${rm.defaultCurrentBg} rounded-lg` : ""
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
        className={`mt-3 flex w-full items-center justify-center rounded-lg text-center font-medium transition-colors ${
          slim
            ? `min-h-[40px] px-2 py-2 text-[11px] leading-tight ${rm.defaultHubLinkBottom}`
            : `mt-4 min-h-[44px] px-3 py-2 text-sm ${rm.defaultHubLinkBottom}`
        }`}
      >
        Ana Ekrana Dön
      </Link>
    </aside>
  );
}
