import { games, getGameBySlug, getWixLandingUrl } from "@/data/games";
import { getTranslations } from "@/lib/i18n";
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

  const coverImagePath =
    slug === "tapinagin-laneti"
      ? "/games/tapinagin-laneti/images/" + encodeURIComponent("Tapınağın Laneti.png")
      : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">
      <main className="relative z-10 min-h-screen">
        <a
          href={getWixLandingUrl(slug)}
          className="absolute left-4 top-4 z-20 inline-flex min-h-[44px] items-center text-sm text-zinc-400 transition-colors hover:text-amber-500 sm:left-6 sm:top-6"
        >
          {t.intro.back}
        </a>

        <div className="grid min-h-screen md:grid-cols-[1.15fr_1fr] md:grid-rows-1 lg:grid-cols-[1.25fr_1fr]">
          {/* Left: cover image – sayfaya sığacak şekilde */}
          <div className="relative order-2 min-h-[32vh] md:order-1 md:min-h-screen md:max-h-screen">
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-950/30 via-zinc-900 to-zinc-950">
              {coverImagePath ? (
                <img
                  src={coverImagePath}
                  alt=""
                  className="h-full w-full object-contain object-center"
                />
              ) : (
                <span className="text-9xl opacity-40">🏛️</span>
              )}
            </div>
          </div>

          {/* Right: story panel – compact text */}
          <div className="order-1 flex flex-col overflow-y-auto bg-gradient-to-b from-amber-950/80 via-amber-950/60 to-amber-950/90 md:order-2 md:min-h-screen">
            <div className="flex flex-1 flex-col px-5 py-10 sm:px-6 sm:py-12">
              <h1 className="mb-4 text-xl font-bold tracking-tight text-amber-100 sm:text-2xl md:text-3xl">
                {game.title}
              </h1>

              <div className="mb-4 flex items-center gap-3 rounded-lg border border-amber-700/40 bg-amber-900/30 px-3 py-2 sm:mb-6">
                <span className="text-lg">🔊</span>
                <span className="text-xs text-amber-200/80 sm:text-sm">{t.intro.audio}</span>
              </div>

              <section className="mb-6">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400/90 sm:text-sm">
                  {t.intro.story}
                </h2>
                <div className="whitespace-pre-line text-sm leading-relaxed text-amber-100/90 sm:text-base">
                  {game.story}
                </div>
              </section>

              <section className="mb-6">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400/90 sm:text-sm">
                  {t.intro.rules}
                </h2>
                <ul className="list-inside list-disc space-y-1.5 text-sm leading-relaxed text-amber-100/90 sm:text-base">
                  {game.rules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </section>

              <div className="mt-auto pt-4">
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
