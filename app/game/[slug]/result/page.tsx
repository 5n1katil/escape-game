import { games, getGameBySlug, getWixLandingUrl } from "@/data/games";
import { getTranslations } from "@/lib/i18n";
import { notFound } from "next/navigation";
import ResultClient from "@/components/ResultClient";

interface ResultPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  const t = getTranslations();

  if (!game) notFound();

  const wixUrl = getWixLandingUrl(slug);
  const g = game as {
    endStoryLong?: string;
    endAudioUrl?: string;
    endImageUrl?: string;
    endGizemMalikanesiUrl?: string;
    endGizemMalikanesiLabel?: string;
  };
  const endStoryLong = g.endStoryLong;
  const endAudioUrl = g.endAudioUrl;
  const endImageUrl = g.endImageUrl;
  const endGizemMalikanesiUrl = g.endGizemMalikanesiUrl;
  const endGizemMalikanesiLabel = g.endGizemMalikanesiLabel;

  return (
    <ResultClient
      slug={slug}
      gameTitle={game.title}
      durationSeconds={game.durationMinutes * 60}
      wixUrl={wixUrl}
      mainPageUrl="https://www.5n1dedektif.com/"
      tResult={t.result}
      tRoomResult={t.room.result}
      endStoryLong={endStoryLong}
      endAudioUrl={endAudioUrl}
      endImageUrl={endImageUrl}
      gizemMalikanesiUrl={endGizemMalikanesiUrl}
      gizemMalikanesiLabel={endGizemMalikanesiLabel}
    />
  );
}
