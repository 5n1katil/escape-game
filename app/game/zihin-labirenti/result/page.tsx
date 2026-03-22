import ResultClient from "@/components/ResultClient";
import { getGameBySlug, getWixLandingUrl, type GameConfig } from "@/data/games";
import { getTranslations } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { ZIHIN_LABIRENTI_SLUG } from "../constants";

export default async function ZihinLabirentiResultPage() {
  const slug = ZIHIN_LABIRENTI_SLUG;
  const game = getGameBySlug(slug);
  const t = getTranslations();

  if (!game) notFound();

  const g = game as GameConfig;
  const wixUrl = getWixLandingUrl(slug);

  return (
    <ResultClient
      slug={slug}
      gameTitle={g.title}
      durationSeconds={g.durationMinutes * 60}
      wixUrl={wixUrl}
      mainPageUrl="https://www.5n1dedektif.com/"
      tResult={t.result}
      tRoomResult={t.room.result}
      endStoryLong={g.endStoryLong}
      endAudioUrl={g.endAudioUrl}
      endImageUrl={g.endImageUrl}
      gizemMalikanesiUrl={g.endGizemMalikanesiUrl}
      gizemMalikanesiLabel={g.endGizemMalikanesiLabel}
    />
  );
}
