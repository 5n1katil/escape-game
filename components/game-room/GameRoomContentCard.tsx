"use client";

import { useGameUi } from "@/components/GameVisualThemeProvider";
import type { ReactNode } from "react";

/**
 * Sol sütun ana içerik — geniş sinematik kart (hikâye + bulmaca).
 */
export default function GameRoomContentCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ui } = useGameUi();
  return (
    <div
      className={`${ui.gameRoom.contentCard} ${className}`}
    >
      {children}
    </div>
  );
}
