import type { ReactNode } from "react";
import GameRoomPageShell from "./GameRoomPageShell";

/**
 * Tüm oyun odası sayfaları için ortak ızgara: tam genişlik başlık + sol içerik + sağ sidebar.
 * xl+ iki sütun; küçük ekranda tek sütun (sidebar altta).
 */
export default function GameRoomLayout({
  header,
  titleWide,
  mainColumn,
  sidebar,
  shellClassName = "",
}: {
  header: ReactNode;
  /** Masaüstü: ızgarada xl:col-span-2 ile tam genişlik */
  titleWide: ReactNode;
  /** Sol: mobil başlık + oyun kartı vb. */
  mainColumn: ReactNode;
  sidebar: ReactNode;
  shellClassName?: string;
}) {
  return (
    <GameRoomPageShell className={`flex flex-1 flex-col pt-2 sm:pt-3 ${shellClassName}`}>
      {header}
      <div className="grid w-full min-w-0 grid-cols-1 items-start gap-6 overflow-hidden xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] xl:gap-10">
        {titleWide}
        {mainColumn}
        {sidebar}
      </div>
    </GameRoomPageShell>
  );
}
