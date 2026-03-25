import CountdownTimer from "@/components/CountdownTimer";
import EscapeRoomGame from "@/components/EscapeRoomGame";
import GameStateGate from "@/components/GameStateGate";
import RestartButton from "@/components/RestartButton";
import {
  GameRoomContentCard,
  GameRoomLayout,
  GameRoomSidebar,
} from "@/components/game-room";
import SessionSync from "@/components/SessionSync";
import { getGameBySlug, getRoomsForGame, type GameConfig } from "@/data/games";
import { getThemeUi } from "@/lib/gameVisualTheme";
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

  const g = game as GameConfig;
  const roomIdNum = parseInt(roomId, 10);
  const roomIndex = rooms.findIndex((r) => r.id === roomIdNum);
  if (roomIndex < 0 || roomIdNum < 1) notFound();

  const rp = getThemeUi(g.visualTheme).roomPage;

  return (
    <GameStateGate slug={slug}>
      <SessionSync slug={slug} roomId={roomIdNum} />
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-zinc-950 md:flex-row">
        <div
          className="pointer-events-none fixed inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-950/80"
          aria-hidden
        />

        <div className="custom-scrollbar relative z-10 flex min-w-0 flex-1 flex-col overflow-y-auto p-4 pt-24 md:p-8 md:pt-28">
          <GameRoomLayout
            header={
              <header className="fixed inset-x-0 top-0 z-[70] mx-auto flex w-full min-w-0 shrink-0 items-center justify-between gap-3 border-b border-zinc-800/70 bg-zinc-950/95 px-4 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-6 sm:py-3.5 md:px-8">
                <Link
                  href={`/game/${slug}/hub`}
                  className={`flex min-h-[50px] min-w-[50px] shrink-0 touch-manipulation items-center justify-center rounded-xl border border-zinc-700/70 bg-zinc-900/70 px-3 text-sm font-medium text-zinc-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/70 hover:bg-cyan-500/10 hover:text-cyan-100 active:translate-y-0 active:scale-[0.98] sm:justify-start sm:px-4 md:text-base ${rp.headerLinkHover}`}
                >
                  {t.room.back}
                </Link>
                <RestartButton slug={slug} label={t.room.restartGame} />
              </header>
            }
            titleWide={
              <h1 className="hidden min-w-0 text-balance pb-1 text-center text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-4xl md:block lg:text-left lg:text-[2.75rem] lg:leading-tight xl:col-span-2 xl:pb-2 xl:text-5xl">
                {g.title}
              </h1>
            }
            mainColumn={
              <div className="min-w-0 space-y-5 xl:space-y-0">
                <div className="min-w-0 pt-2 md:hidden">
                  <h1 className="mb-5 text-center text-xl font-bold tracking-tight text-white drop-shadow-lg sm:text-2xl">
                    {g.title}
                  </h1>
                </div>
                <GameRoomContentCard>
                  <EscapeRoomGame
                    slug={slug}
                    roomIndex={roomIndex}
                    rooms={rooms}
                    t={t.room}
                    backToHubLabel={t.hub.backToHub}
                    finalCode={g.finalCode}
                  />
                </GameRoomContentCard>
              </div>
            }
            sidebar={
              <GameRoomSidebar
                slug={slug}
                durationMinutes={g.durationMinutes}
                timerAriaLabel={t.room.timerAriaLabel}
                timerHudLabel={t.room.timerHudLabel}
                currentRoomIndex={roomIndex}
                rooms={rooms}
              />
            }
          />
        </div>
      </div>
    </GameStateGate>
  );
}
