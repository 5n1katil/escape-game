import type { ReactNode } from "react";

/**
 * Tüm oyun odası sayfaları için güvenli dış kabuk: gutter, max genişlik, yatay taşma yok.
 */
export default function GameRoomPageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full min-w-0 max-w-[1800px] px-4 sm:px-6 lg:px-10 xl:px-14 pb-10 ${className}`}
    >
      {children}
    </div>
  );
}
