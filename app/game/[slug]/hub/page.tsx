import GameStateGate from "@/components/GameStateGate";
import HubClient from "@/components/HubClient";
import { getGameBySlug, getRoomsForGame, getSlugsForDynamicGameSegment, type GameConfig } from "@/data/games";
import { getTranslations } from "@/lib/i18n";
import { notFound } from "next/navigation";

interface HubPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getSlugsForDynamicGameSegment();
}

export default async function HubPage({ params }: HubPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  const rooms = getRoomsForGame(slug);
  const t = getTranslations();

  if (!game || rooms.length === 0) notFound();

  const g = game as GameConfig;
  const story = g.hubStory;
  const storyAudioUrl = g.hubStoryAudioUrl ?? null;

  return (
    <GameStateGate slug={slug}>
      <HubClient
        slug={slug}
        gameTitle={game.title}
        story={story}
        storyAudioUrl={storyAudioUrl || undefined}
        rooms={rooms}
        finalCode={game.finalCode}
        t={t.hub}
        timerAriaLabel={t.room.timerAriaLabel}
        timerHudLabel={t.room.timerHudLabel}
        durationMinutes={game.durationMinutes}
        mapImageSrc={game.mapImagePath}
        mapSegments={game.mapSegments}
      />
    </GameStateGate>
  );
}
