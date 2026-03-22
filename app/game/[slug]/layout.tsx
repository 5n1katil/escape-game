import { GameVisualThemeProvider } from "@/components/GameVisualThemeProvider";

/**
 * Game layout. Auth/payment gate can be inserted here later
 * to wrap intro and room routes.
 */
export default async function GameLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <GameVisualThemeProvider slug={slug}>{children}</GameVisualThemeProvider>;
}
