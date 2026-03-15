import { games, getGameBySlug } from "@/data/games";
import { getTranslations } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";
import IntroStartButton from "./IntroStartButton";

interface IntroPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export default async function IntroPage({ params }: IntroPageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  const t = getTranslations();

  if (!game) notFound();

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">
      <main className="relative z-10 min-h-screen">
        <Link
          href="/escape-rooms"
          className="absolute left-4 top-4 z-20 inline-flex min-h-[44px] items-center text-sm text-zinc-400 transition-colors hover:text-amber-500 sm:left-6 sm:top-6"
        >
          {t.intro.back}
        </Link>

        <div className="grid min-h-screen md:grid-cols-2 md:grid-rows-1">
          {/* Left: large cover image */}
          <div className="relative order-2 min-h-[40vh] md:order-1 md:min-h-screen">
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-950">
              <span className="text-9xl opacity-40">🏛️</span>
            </div>
          </div>

          {/* Right: brown/gold story panel */}
          <div className="order-1 flex flex-col overflow-y-auto bg-gradient-to-b from-amber-950/80 via-amber-950/60 to-amber-950/90 md:order-2 md:min-h-screen">
            <div className="flex flex-1 flex-col px-6 py-12 sm:px-8 sm:py-16">
              <h1 className="mb-6 text-2xl font-bold tracking-tight text-amber-100 sm:text-3xl md:text-4xl lg:text-5xl">
                {game.title}
              </h1>

              <div className="mb-6 flex items-center gap-4 rounded-lg border border-amber-700/40 bg-amber-900/30 px-4 py-3 sm:mb-8">
                <span className="text-2xl">🔊</span>
                <span className="text-sm text-amber-200/80">{t.intro.audio}</span>
              </div>

              <section className="mb-8">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-400/90">
                  {t.intro.story}
                </h2>
                <div className="whitespace-pre-line text-base leading-relaxed text-amber-100/90 sm:text-lg">
                  {game.story}
                </div>
              </section>

              <section className="mb-8">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-400/90">
                  {t.intro.rules}
                </h2>
                <ul className="list-inside list-disc space-y-2 text-base leading-relaxed text-amber-100/90 sm:text-lg">
                  {game.rules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </section>

              <div className="mb-8">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-400/90">
                  {t.intro.mapPreview}
                </h2>
                <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border border-amber-700/40 bg-amber-900/20">
                  <span className="text-4xl opacity-60">🗺️</span>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <IntroStartButton
                  slug={slug}
                  durationSeconds={game.durationMinutes * 60}
                  firstRoomId={1}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
