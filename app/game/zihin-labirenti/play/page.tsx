import { getGameBySlug } from "@/data/games";
import { redirect } from "next/navigation";
import { ZIHIN_LABIRENTI_SLUG } from "../constants";

/** Zamanlayıcı yalnızca intro’daki “Oyunu Başlat” ile başlar. */
export default async function ZihinLabirentiPlayPage() {
  const slug = ZIHIN_LABIRENTI_SLUG;
  const game = getGameBySlug(slug);

  if (!game) redirect("/escape-rooms");

  redirect(`/game/${slug}/intro`);
}
