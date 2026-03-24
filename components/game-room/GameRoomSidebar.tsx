"use client";

import CountdownTimer from "@/components/CountdownTimer";
import { useGameUi } from "@/components/GameVisualThemeProvider";
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
  const { ui } = useGameUi();
  return (
    <aside
      className="game-room-sidebar relative min-h-px min-w-0 w-full max-w-full overflow-hidden xl:w-[400px] xl:max-w-[400px] xl:shrink-0"
      aria-label="Sayaç ve ilerleme"
    >
      <div className={ui.gameRoom.sidebar}>
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
