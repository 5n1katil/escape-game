import CountdownTimer from "@/components/CountdownTimer";
import EscapeRoomGame from "@/components/EscapeRoomGame";
import GameStateGate from "@/components/GameStateGate";
import RestartButton from "@/components/RestartButton";
import RoomMap from "@/components/RoomMap";
import {
  GameRoomContentCard,
  GameRoomLayout,
  GameRoomSidebar,
} from "@/components/game-room";
import TempleMap from "@/components/TempleMap";
import SessionSync from "@/components/SessionSync";
import { getGameBySlug, getRoomsForGame, type GameConfig } from "@/data/games";
import { getThemeUi } from "@/lib/gameVisualTheme";
import { getTranslations } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ZIHIN_LABIRENTI_SLUG } from "../../constants";

interface ZihinRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default async function ZihinLabirentiRoomPage({
  params,
}: ZihinRoomPageProps) {
  const slug = ZIHIN_LABIRENTI_SLUG;
  const { roomId } = await params;
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
      <div className="relative flex min-h-screen flex-col bg-zinc-950">
        <div
          className="pointer-events-none fixed inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-950/80"
          aria-hidden
        />

        <div className="sticky top-0 z-[60] w-full min-w-0 md:hidden">
          <CountdownTimer
            slug={slug}
            initialMinutes={g.durationMinutes}
            ariaLabelTemplate={t.room.timerAriaLabel}
            variant="mobileBar"
            label={t.room.timerHudLabel}
          />
          <div
            className={`border-b ${rp.mapStripBorder} bg-zinc-950/95 px-3 pb-2 pt-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md sm:px-4`}
          >
            <p className={`mb-1.5 text-center ${rp.mapTitle}`}>{t.hub.map}</p>
            <TempleMap
              slug={slug}
              rooms={rooms}
              goToRoomLabel={t.hub.goToRoom}
              imageFit="contain"
              containImgClassName="h-auto w-full max-h-[min(65vh,560px)] object-contain"
              mapImageSrc={g.mapImagePath}
            />
          </div>
          <div
            className={`border-b ${rp.mapStripBorder} bg-zinc-950/95 px-3 pb-2 pt-1.5 backdrop-blur-md sm:px-4`}
          >
            <RoomMap
              slug={slug}
              currentRoomIndex={roomIndex}
              rooms={rooms}
              density="sidebar"
              compactStrip
            />
          </div>
        </div>

        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <GameRoomLayout
            header={
              <header className="mb-4 flex w-full min-w-0 shrink-0 items-center justify-between gap-4 border-b border-zinc-800/70 bg-zinc-950/92 py-3 backdrop-blur-md sm:mb-5 sm:py-3.5 xl:sticky xl:top-0 xl:z-40">
                <Link
                  href={`/game/${slug}/hub`}
                  className={`flex min-h-[44px] min-w-[44px] shrink-0 touch-manipulation items-center justify-center rounded-lg text-sm text-zinc-500 transition-colors active:bg-zinc-800/50 sm:justify-start sm:px-3 ${rp.headerLinkHover}`}
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
