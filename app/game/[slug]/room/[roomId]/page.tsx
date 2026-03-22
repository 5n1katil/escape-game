import CountdownTimer from "@/components/CountdownTimer";
import EscapeRoomGame from "@/components/EscapeRoomGame";
import GameStateGate from "@/components/GameStateGate";
import RestartButton from "@/components/RestartButton";
import RoomMap from "@/components/RoomMap";
import RoomTacticalPanel from "@/components/RoomTacticalPanel";
import TempleMap from "@/components/TempleMap";
import SessionSync from "@/components/SessionSync";
import { getGameBySlug, getRoomsForGame } from "@/data/games";
import { getTranslations } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";

interface RoomPageProps {
  params: Promise<{ slug: string; roomId: string }>;
}

/** Masaüstü başlık + iki sütun yatay padding — hizalı bütünlük */
const ROOM_PAGE_GUTTER =
  "px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12";

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
        Masaüstü: tam genişlik başlık bandı + altında sol metin | sağ geniş taktik çerçeve (sticky).
        Mobil: üstte yapışkan HUD (sayaç + harita + ilerleme), sonra akış.
      */}
      <div className="relative flex min-h-screen flex-col bg-zinc-950">
        <div
          className="pointer-events-none fixed inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-950/80"
          aria-hidden
        />

        <div className="sticky top-0 z-[60] w-full md:hidden">
          <CountdownTimer
            slug={slug}
            initialMinutes={game.durationMinutes}
            ariaLabelTemplate={t.room.timerAriaLabel}
            variant="mobileBar"
            label={t.room.timerHudLabel}
          />
          <div className="border-b border-amber-900/40 bg-zinc-950/95 px-2 pb-2 pt-2 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <p className="mb-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/90">
              {t.hub.map}
            </p>
            <TempleMap
              slug={slug}
              rooms={rooms}
              goToRoomLabel={t.hub.goToRoom}
              imageFit="contain"
              containImgClassName="h-auto w-full max-h-[min(65vh,560px)] object-contain"
            />
          </div>
          <div className="border-b border-amber-900/40 bg-zinc-950/95 px-2 pb-2 pt-1.5 backdrop-blur-md">
            <RoomMap
              slug={slug}
              currentRoomIndex={roomIndex}
              rooms={rooms}
              density="sidebar"
              compactStrip
            />
          </div>
        </div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <header
            className={`z-40 flex w-full shrink-0 items-center justify-between border-b border-zinc-800/70 bg-zinc-950/92 py-3 backdrop-blur-md ${ROOM_PAGE_GUTTER} md:sticky md:top-0`}
          >
            <Link
              href={`/game/${slug}/hub`}
              className="flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-lg text-sm text-zinc-500 transition-colors hover:text-amber-500 active:bg-zinc-800/50 sm:justify-start sm:px-2"
            >
              {t.room.back}
            </Link>
            <RestartButton slug={slug} label={t.room.restartGame} />
          </header>

          {/* Masaüstü: oyun başlığı tam genişlik, tek sütuna hapsolmaz */}
          <div
            className={`hidden shrink-0 border-b border-zinc-800/50 bg-zinc-950/55 py-5 backdrop-blur-sm sm:py-6 md:block lg:py-7 ${ROOM_PAGE_GUTTER}`}
          >
            <h1 className="text-balance text-center text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-4xl lg:text-left lg:text-[2.75rem] lg:leading-tight xl:text-5xl">
              {game.title}
            </h1>
          </div>

          <div className="flex min-h-0 flex-1 flex-col md:flex-row md:items-stretch">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <div className={`pt-6 md:hidden ${ROOM_PAGE_GUTTER}`}>
                <h1 className="mb-5 text-center text-xl font-bold tracking-tight text-white drop-shadow-lg sm:text-2xl">
                  {game.title}
                </h1>
              </div>
              <div className={`flex-1 pb-24 pt-2 md:pt-8 ${ROOM_PAGE_GUTTER}`}>
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
              className={`room-panel-no-scrollbar relative z-20 hidden min-h-0 w-full shrink-0 border-amber-900/35 bg-zinc-950/90 md:flex md:max-h-[calc(100dvh-1.25rem)] md:min-w-[400px] md:max-w-[min(540px,46vw)] md:w-[min(500px,44%)] md:flex-col md:overflow-hidden md:border-l md:px-3 md:py-3 md:sticky md:top-2 md:self-start lg:min-w-[440px] lg:max-w-[520px] lg:px-4 lg:py-4`}
              aria-label="Sayaç ve ilerleme"
            >
              <RoomTacticalPanel>
                <CountdownTimer
                  slug={slug}
                  initialMinutes={game.durationMinutes}
                  ariaLabelTemplate={t.room.timerAriaLabel}
                  variant="tacticalWide"
                  label={t.room.timerHudLabel}
                />
                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                  <RoomMap
                    slug={slug}
                    currentRoomIndex={roomIndex}
                    rooms={rooms}
                    density="sidebar"
                    fillColumn
                    embeddedInFrame
                  />
                </div>
              </RoomTacticalPanel>
            </aside>
          </div>
        </div>
      </div>
    </GameStateGate>
  );
}
