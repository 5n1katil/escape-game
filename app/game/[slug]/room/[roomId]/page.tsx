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
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-950/80"
        aria-hidden
      />

      <main className="relative z-10 flex min-h-screen flex-col gap-6 px-4 py-20 pb-24 sm:gap-10 sm:px-6 sm:py-16 md:flex-row md:items-start md:justify-center md:gap-8 md:pt-24 lg:gap-12 lg:px-8">
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between sm:left-6 sm:right-6 sm:top-6 md:left-6 md:right-6">
          <Link
            href={`/game/${slug}/hub`}
            className="flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-lg text-sm text-zinc-500 transition-colors hover:text-amber-500 active:bg-zinc-800/50 sm:justify-start sm:px-2"
          >
            {t.room.back}
          </Link>
          <RestartButton slug={slug} label={t.room.restartGame} />
        </div>

        <div className="flex w-full flex-1 flex-col items-center gap-6 text-center sm:gap-8 md:max-w-2xl md:gap-10">
          <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
            {game.title}
          </h1>

          <CountdownTimer
            slug={slug}
            initialMinutes={game.durationMinutes}
            ariaLabelTemplate={t.room.timerAriaLabel}
          />

          <div className="mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-4 text-left sm:space-y-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
            <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
              {game.story.split("\n\n")[0]}
            </p>
            <p className="text-base leading-relaxed text-zinc-300 sm:text-lg">
              {game.story.split("\n\n")[1]}
            </p>
          </div>

          <EscapeRoomGame
            slug={slug}
            roomIndex={roomIndex}
            rooms={rooms}
            t={t.room}
            backToHubLabel={t.hub.backToHub}
            finalCode={"finalCode" in game ? (game as { finalCode?: string }).finalCode : undefined}
          />
        </div>

        <div className="flex w-full justify-center md:sticky md:top-24 md:w-52 md:shrink-0 lg:w-56">
          <RoomMap
            slug={slug}
            currentRoomIndex={roomIndex}
            rooms={rooms}
          />
        </div>
      </main>
    </div>
    </GameStateGate>
  );
}
