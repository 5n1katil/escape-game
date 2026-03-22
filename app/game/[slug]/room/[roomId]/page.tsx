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
      <div className="relative flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-zinc-950">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-950/80"
          aria-hidden
        />

        <header className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-4 pt-4 sm:left-6 sm:right-6 sm:px-0 sm:pt-6">
          <Link
            href={`/game/${slug}/hub`}
            className="flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-lg text-sm text-zinc-500 transition-colors hover:text-amber-500 active:bg-zinc-800/50 sm:justify-start sm:px-2"
          >
            {t.room.back}
          </Link>
          <RestartButton slug={slug} label={t.room.restartGame} />
        </header>

        {/*
          Hub ile aynı mantık: sol sütun tek scroll; sağ (mobilde üst) sütunda sayaç + ilerleme sabit kalır,
          yalnızca hikâye/bulmaca alanı kayar.
        */}
        <div className="flex min-h-0 flex-1 flex-col pt-16 sm:pt-[4.5rem] md:flex-row md:pt-16">
          <div className="order-2 flex min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-y-contain px-4 pb-8 pt-2 sm:px-6 md:order-1 md:px-8 md:pb-10 md:pt-4 lg:px-10">
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

          <aside
            className="order-1 flex w-full shrink-0 flex-col gap-3 border-b border-amber-900/40 bg-zinc-950/95 px-4 py-3 backdrop-blur-md sm:px-5 md:order-2 md:h-full md:min-h-0 md:w-[min(100%,288px)] md:shrink-0 md:border-b-0 md:border-l md:border-amber-900/35 md:px-4 md:py-5 lg:w-80"
            aria-label="Sayaç ve ilerleme"
          >
            <div className="shrink-0">
              <CountdownTimer
                slug={slug}
                initialMinutes={game.durationMinutes}
                ariaLabelTemplate={t.room.timerAriaLabel}
                variant="tactical"
                label={t.room.timerHudLabel}
                tacticalFooter={t.room.timerHudFooter}
              />
            </div>
            <div className="flex min-h-0 max-h-[38vh] flex-1 flex-col overflow-y-auto overscroll-y-contain md:min-h-0 md:max-h-none md:flex-1">
              <RoomMap slug={slug} currentRoomIndex={roomIndex} rooms={rooms} />
            </div>
          </aside>
        </div>
      </div>
    </GameStateGate>
  );
}
