import { getGameBySlug } from "@/data/games";
import { redirect } from "next/navigation";

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) redirect("/escape-rooms");

  redirect(`/game/${slug}/room/1`);
}
