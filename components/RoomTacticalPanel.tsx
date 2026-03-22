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
  return (
    <div
      className={`room-tactical-panel flex min-h-0 w-full min-w-0 flex-1 flex-col gap-3 overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-zinc-900/85 via-zinc-950/95 to-zinc-950 p-4 shadow-[0_0_48px_rgba(245,158,11,0.1),inset_0_1px_0_rgba(251,191,36,0.12)] ring-1 ring-amber-950/45 sm:gap-3.5 sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}
