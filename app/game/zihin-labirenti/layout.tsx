import { GameVisualThemeProvider } from "@/components/GameVisualThemeProvider";
import { ZIHIN_LABIRENTI_SLUG } from "./constants";

export default function ZihinLabirentiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GameVisualThemeProvider slug={ZIHIN_LABIRENTI_SLUG}>
      {children}
    </GameVisualThemeProvider>
  );
}
