"use client";

import { useGameUi } from "@/components/GameVisualThemeProvider";
import type { ReactNode } from "react";

/**
 * Oyun odası masaüstü — sayaç + ilerleme için ortak “toptan taktik çerçeve”.
 * Tüm dava/room sağ paneli bu kabukla tutarlı kalır.
 */
export default function RoomTacticalPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ui } = useGameUi();
  return (
    <div
      className={`${ui.gameRoom.tacticalPanel} ${className}`}
    >
      {children}
    </div>
  );
}
