import { getTranslations } from "@/lib/i18n";
import Link from "next/link";

export default function Home() {
  const t = getTranslations();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950">
      {/* Subtle cinematic gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-950/80"
        aria-hidden
      />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-8 text-center sm:gap-10 sm:px-6 sm:py-12 md:gap-12">
        <div className="space-y-3 sm:space-y-5 md:space-y-6">
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
            {t.home.title}
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg md:text-xl">
            {t.home.subtitle}
          </p>
        </div>

        <Link
          href="/escape-rooms"
          className="inline-flex min-h-[48px] w-full max-w-[280px] touch-manipulation items-center justify-center rounded-lg bg-amber-600 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-amber-900/30 transition-all hover:bg-amber-500 hover:shadow-amber-500/25 hover:scale-105 active:scale-100 sm:min-h-[56px] sm:w-auto sm:min-w-[280px] sm:py-3"
        >
          {t.home.cta}
        </Link>
      </main>
    </div>
  );
}
