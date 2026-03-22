import CountdownTimer from "@/components/CountdownTimer";
import EscapeRoomGame from "@/components/EscapeRoomGame";
import GameStateGate from "@/components/GameStateGate";
import RestartButton from "@/components/RestartButton";
import RoomMap from "@/components/RoomMap";
import SessionSync from "@/components/SessionSync";
import { getGameBySlug, getRoomsForGame } from "@/data/games";
import { getTranslations } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";

interface RoomPageProps {
  params: Promise<{ slug: string; roomId: string }>;
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { slug, roomId } = await params;
  const game = getGameBySlug(slug);
  const rooms = getRoomsForGame(slug);
  const t = getTranslations();

  if (!game || rooms.length === 0) notFound();

  const roomIdNum = parseInt(roomId, 10);
  const roomIndex = rooms.findIndex((r) => r.id === roomIdNum);
  if (roomIndex < 0 || roomIdNum < 1) notFound();

  return (
    <GameStateGate slug={slug}>
      <SessionSync slug={slug} roomId={roomIdNum} />
      {/*
        overflow-hidden YOK — body scroll + md:sticky sağ sütun.
        Mobil: üstte yapışkan sayaç (mobileBar). Masaüstü: sağ panel h-screen, iç scroll yok.
      */}
      <div className="relative flex min-h-screen flex-col bg-zinc-950 md:flex-row">
        <div
          className="pointer-events-none fixed inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-950/80"
          aria-hidden
        />

        {/* Mobil: sayaç en üstte, yapışkan — hikâye kayarken görünür kalır */}
        <div className="sticky top-0 z-[60] w-full md:hidden">
          <CountdownTimer
            slug={slug}
            initialMinutes={game.durationMinutes}
            ariaLabelTemplate={t.room.timerAriaLabel}
            variant="mobileBar"
            label={t.room.timerHudLabel}
          />
        </div>

        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <header className="z-40 flex items-center justify-between border-b border-zinc-800/70 bg-zinc-950/92 px-4 py-3 backdrop-blur-md sm:px-6 md:sticky md:top-0">
            <Link
              href={`/game/${slug}/hub`}
              className="flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-lg text-sm text-zinc-500 transition-colors hover:text-amber-500 active:bg-zinc-800/50 sm:justify-start sm:px-2"
            >
              {t.room.back}
            </Link>
            <RestartButton slug={slug} label={t.room.restartGame} />
          </header>

          <div className="flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8">
            <h1 className="mb-5 text-center text-xl font-bold tracking-tight text-white drop-shadow-lg sm:text-2xl md:mb-6 md:text-left md:text-3xl lg:text-4xl">
              {game.title}
            </h1>
            <EscapeRoomGame
              slug={slug}
              roomIndex={roomIndex}
              rooms={rooms}
              t={t.room}
              backToHubLabel={t.hub.backToHub}
              finalCode={"finalCode" in game ? (game as { finalCode?: string }).finalCode : undefined}
            />
          </div>
        </div>

        <aside
          className="room-panel-no-scrollbar z-20 hidden h-screen w-[340px] shrink-0 flex-col border-l border-amber-900/35 bg-zinc-950/95 p-4 backdrop-blur-sm md:sticky md:top-0 md:self-start md:flex lg:w-[380px]"
          aria-label="Sayaç ve ilerleme"
        >
          <CountdownTimer
            slug={slug}
            initialMinutes={game.durationMinutes}
            ariaLabelTemplate={t.room.timerAriaLabel}
            variant="tactical"
            label={t.room.timerHudLabel}
          />
          <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden">
            <RoomMap
              slug={slug}
              currentRoomIndex={roomIndex}
              rooms={rooms}
              density="sidebar"
              fillColumn
            />
          </div>
        </aside>
      </div>
    </GameStateGate>
  );
}
