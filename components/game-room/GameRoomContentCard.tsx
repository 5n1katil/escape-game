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
  return (
    <div
      className={`w-full min-w-0 rounded-2xl border border-amber-500/10 bg-[#0b1120]/80 p-5 shadow-[0_0_30px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6 lg:p-8 xl:p-10 ${className}`}
    >
      {children}
    </div>
  );
}
