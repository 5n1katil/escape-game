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

  const introAudioUrl =
    typeof (game as { introAudioUrl?: string }).introAudioUrl === "string"
      ? (game as { introAudioUrl: string }).introAudioUrl
      : null;

  return (
    <div className="relative h-screen overflow-hidden bg-zinc-950">
      <main className="relative z-10 h-full">
        <a
          href={getWixLandingUrl(slug)}
          className="absolute left-4 top-4 z-20 inline-flex min-h-[44px] items-center text-sm text-zinc-400 transition-colors hover:text-amber-500 sm:left-6 sm:top-6"
        >
          {t.intro.back}
        </a>

        <div className="grid h-full min-h-0 md:grid-cols-[1.4fr_1fr] md:grid-rows-1 lg:grid-cols-[1.6fr_1fr]">
          {/* Sol: görsel paneli tam kaplar, sayfa burada biter */}
          <div className="relative order-2 min-h-[35vh] md:order-1 md:h-full md:min-h-0">
            <div className="absolute inset-0 bg-zinc-950">
              {coverImagePath ? (
                <img
                  src={coverImagePath}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-9xl opacity-40">🏛️</span>
              )}
            </div>
          </div>

          {/* Sağ: görselin bittiği yerde sınırlı, içerik küçültüldü, kaydırılabilir */}
          <div className="order-1 flex min-h-0 flex-col overflow-y-auto bg-gradient-to-b from-amber-950/80 via-amber-950/60 to-amber-950/90 md:order-2 md:h-full">
            <div className="flex flex-1 flex-col px-4 py-6 sm:px-5 sm:py-8">
              <h1 className="mb-2 text-lg font-bold tracking-tight text-amber-100 sm:text-xl md:text-2xl">
                {game.title}
              </h1>

              <div className="mb-3 sm:mb-4">
                {introAudioUrl ? (
                  <div className="rounded-lg border border-amber-700/40 bg-amber-900/30 px-2.5 py-2">
                    <p className="mb-1.5 text-xs text-amber-200/80">{t.intro.audio}</p>
                    <audio
                      controls
                      src={introAudioUrl}
                      className="h-9 w-full max-w-md"
                      preload="metadata"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-amber-700/40 bg-amber-900/30 px-2.5 py-1.5">
                    <span className="text-base">🔊</span>
                    <span className="text-xs text-amber-200/80">{t.intro.audio}</span>
                  </div>
                )}
              </div>

              <section className="mb-4">
                <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400/90">
                  {t.intro.story}
                </h2>
                <div className="whitespace-pre-line text-xs leading-relaxed text-amber-100/90 sm:text-sm">
                  {game.story}
                </div>
              </section>

              <section className="mb-4">
                <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400/90">
                  {t.intro.rules}
                </h2>
                <ul className="list-inside list-disc space-y-1 text-xs leading-relaxed text-amber-100/90 sm:text-sm">
                  {game.rules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </section>

              <div className="mt-auto pt-3">
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
