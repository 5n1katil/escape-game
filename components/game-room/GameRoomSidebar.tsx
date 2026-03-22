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
 * Sağ taktik sütun.
 * xl+: panel viewport’ta fixed — scroll’da önce kayıp sonra yapışma hissi olmaz.
 * &lt;xl: akış içi, içerik altında tam genişlik.
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
      className="game-room-sidebar relative min-h-px min-w-0 w-full xl:w-[400px] xl:shrink-0"
      aria-label="Sayaç ve ilerleme"
    >
      <div
        className="box-border flex w-full min-w-0 flex-col gap-4 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#111827] to-[#0b1120] p-5 shadow-[0_0_35px_rgba(245,158,11,0.12)] xl:fixed xl:top-28 xl:z-[35] xl:max-h-[calc(100vh-7.5rem)] xl:w-[400px] xl:overflow-hidden xl:pr-1 xl:shadow-[0_0_40px_rgba(245,158,11,0.14)] xl:right-[max(1rem,calc((100vw-1800px)/2+3.5rem))]"
      >
        <div className="box-border w-full min-w-0 shrink-0">
          <CountdownTimer
            slug={slug}
            initialMinutes={durationMinutes}
            ariaLabelTemplate={timerAriaLabel}
            variant="tacticalWide"
            label={timerHudLabel}
          />
        </div>
        <div className="game-room-sidebar-scroll box-border min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-0.5 pb-1.5 pt-0.5 xl:min-h-[10rem] xl:pr-1.5">
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
