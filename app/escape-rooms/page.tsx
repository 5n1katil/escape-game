import { games } from "@/data/games";
import { getTranslations } from "@/lib/i18n";
import Link from "next/link";

export default function EscapeRoomsPage() {
  const t = getTranslations();

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-950/80"
        aria-hidden
      />

      <main className="relative z-10 min-h-screen px-4 py-12 sm:px-6 sm:py-16 md:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="mb-8 inline-flex min-h-[44px] items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-amber-500 sm:mb-10"
          >
            {t.escapeRooms.back}
          </Link>

          <div className="mb-10 space-y-3 text-center sm:mb-14">
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl">
              {t.escapeRooms.title}
            </h1>
            <p className="mx-auto max-w-xl text-base text-zinc-400 sm:text-lg">
              {t.escapeRooms.subtitle}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {games.map((game) => (
              <Link
                key={game.slug}
                href={`/game/${game.slug}/intro`}
                className={`group flex flex-col overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/40 transition-all hover:bg-zinc-900/60 active:scale-[0.99] ${
                  game.visualTheme === "cyber"
                    ? "hover:border-cyan-500/35"
                    : "hover:border-amber-500/30"
                }`}
              >
                <div className="aspect-video w-full bg-zinc-800/50">
                  <div className="flex h-full w-full items-center justify-center text-zinc-600">
                    <span className="text-4xl">{game.visualTheme === "cyber" ? "🧠" : "🏛️"}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
                  <h2 className="text-lg font-semibold text-white sm:text-xl">
                    {game.title}
                  </h2>
                  <p className="line-clamp-2 text-sm text-zinc-400">
                    {game.story.slice(0, 120)}…
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-xs text-zinc-500">
                      {game.roomCount} oda · {game.durationMinutes} dk
                    </span>
                    <span
                      className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                        game.visualTheme === "cyber"
                          ? "bg-cyan-600 group-hover:bg-cyan-500"
                          : "bg-amber-600 group-hover:bg-amber-500"
                      }`}
                    >
                      {t.escapeRooms.play}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
