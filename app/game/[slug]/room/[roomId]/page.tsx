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
        Tek kaydırma: iç overflow yok; yalnızca tarayıcı scrollbar’ı.
        md+: grid tek satır → sağ hücre içeriği kadar uzar; sticky sağ panel görünür kalır.
      */}
      <div className="relative min-h-screen bg-zinc-950">
        <div
          className="pointer-events-none fixed inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-950/80"
          aria-hidden
        />

        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800/70 bg-zinc-950/92 px-4 py-3 backdrop-blur-md sm:px-6">
          <Link
            href={`/game/${slug}/hub`}
            className="flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-lg text-sm text-zinc-500 transition-colors hover:text-amber-500 active:bg-zinc-800/50 sm:justify-start sm:px-2"
          >
            {t.room.back}
          </Link>
          <RestartButton slug={slug} label={t.room.restartGame} />
        </header>

        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_10.5rem] md:items-start md:gap-6 lg:grid-cols-[minmax(0,1fr)_10rem] lg:gap-8">
            <div className="min-w-0 md:col-start-1 md:row-start-1">
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
              className="mx-auto w-full max-w-[260px] md:col-start-2 md:row-start-1 md:mx-0 md:max-w-none"
              aria-label="Sayaç ve ilerleme"
            >
              <div className="flex flex-col gap-3 md:sticky md:top-24 md:z-20 lg:top-28">
                <CountdownTimer
                  slug={slug}
                  initialMinutes={game.durationMinutes}
                  ariaLabelTemplate={t.room.timerAriaLabel}
                  variant="tactical"
                  label={t.room.timerHudLabel}
                />
                <RoomMap
                  slug={slug}
                  currentRoomIndex={roomIndex}
                  rooms={rooms}
                  density="slim"
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </GameStateGate>
  );
}
