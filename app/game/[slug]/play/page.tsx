import { getGameBySlug } from "@/data/games";
import { redirect } from "next/navigation";

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

/** Redirect to intro so timer starts only when user clicks "Oyunu Başlat". */
export default async function PlayPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) redirect("/escape-rooms");

  redirect(`/game/${slug}/intro`);
}
