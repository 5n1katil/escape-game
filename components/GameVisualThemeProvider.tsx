"use client";

import type { VisualThemeId } from "@/data/games";
import { getVisualThemeForSlug, THEME_UI, type GameUiTokens } from "@/lib/gameVisualTheme";
import { createContext, useContext, useMemo } from "react";

type GameUiContextValue = {
  themeId: VisualThemeId;
  ui: GameUiTokens;
};

const GameUiContext = createContext<GameUiContextValue | null>(null);

export function GameVisualThemeProvider({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const themeId = getVisualThemeForSlug(slug);
  const value = useMemo(
    () => ({ themeId, ui: THEME_UI[themeId] }),
    [themeId]
  );
  return <GameUiContext.Provider value={value}>{children}</GameUiContext.Provider>;
}

/** Oyun rotaları dışında (ör. liste) varsayılan tapınak teması döner. */
export function useGameUi(): GameUiContextValue {
  const ctx = useContext(GameUiContext);
  if (!ctx) {
    return { themeId: "temple", ui: THEME_UI.temple };
  }
  return ctx;
}
