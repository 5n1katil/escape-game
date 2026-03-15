import GameStateGate from "@/components/GameStateGate";
import HubClient from "@/components/HubClient";
import { games, getGameBySlug, getRoomsForGame } from "@/data/games";
import { getTranslations } from "@/lib/i18n";
import { notFound } from "next/navigation";

interface HubPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export default async function HubPage({ params }: HubPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  const rooms = getRoomsForGame(slug);
  const t = getTranslations();

  if (!game || rooms.length === 0) notFound();

  const finalCode = "finalCode" in game ? (game as { finalCode?: string }).finalCode : undefined;

  return (
    <GameStateGate slug={slug}>
      <HubClient
        slug={slug}
        gameTitle={game.title}
        story={game.story}
        rooms={rooms}
        finalCode={finalCode}
        t={t.hub}
        timerAriaLabel={t.room.timerAriaLabel}
        durationMinutes={game.durationMinutes}
      />
    </GameStateGate>
  );
}
