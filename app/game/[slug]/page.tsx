import { getGameBySlug } from "@/data/games";
import { redirect } from "next/navigation";

interface GameRootPageProps {
  params: Promise<{ slug: string }>;
}

export default async function GameRootPage({ params }: GameRootPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) redirect("/escape-rooms");

  redirect(`/game/${slug}/intro`);
}
