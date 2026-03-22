import CountdownTimer from "@/components/CountdownTimer";
import RoomMap from "@/components/RoomMap";
import type { Room } from "@/data/rooms";

interface GameRoomSidebarProps {
  slug: string;
  durationMinutes: number;
  timerAriaLabel: string;
  timerHudLabel: string;
  currentRoomIndex: number;
  rooms: readonly Room[];
}

/**
 * Sağ taktik sütun: sayaç + ilerleme. xl+ yapışkan; küçük ekranda içerik altında tam genişlik.
 */
export default function GameRoomSidebar({
  slug,
  durationMinutes,
  timerAriaLabel,
  timerHudLabel,
  currentRoomIndex,
  rooms,
}: GameRoomSidebarProps) {
  return (
    <aside
      className="game-room-sidebar min-w-0 w-full xl:sticky xl:top-6 xl:self-start"
      aria-label="Sayaç ve ilerleme"
    >
      <div className="flex min-h-0 w-full flex-col gap-4 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#111827] to-[#0b1120] p-5 shadow-[0_0_35px_rgba(245,158,11,0.12)] xl:max-h-[calc(100vh-3rem)] xl:overflow-hidden">
        <div className="shrink-0">
          <CountdownTimer
            slug={slug}
            initialMinutes={durationMinutes}
            ariaLabelTemplate={timerAriaLabel}
            variant="tacticalWide"
            label={timerHudLabel}
          />
        </div>
        <div className="game-room-sidebar-scroll min-h-0 min-w-0 flex-1 overflow-y-auto xl:min-h-[12rem]">
          <RoomMap
            slug={slug}
            currentRoomIndex={currentRoomIndex}
            rooms={rooms}
            density="sidebar"
            fillColumn
            embeddedInFrame
          />
        </div>
      </div>
    </aside>
  );
}
