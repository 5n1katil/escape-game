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

  return (
    <ResultClient
      slug={slug}
      gameTitle={game.title}
      wixUrl={wixUrl}
      tResult={t.result}
      tRoomResult={t.room.result}
    />
  );
}
