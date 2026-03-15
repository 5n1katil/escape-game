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
        {/* Geri butonu: mobilde sağda, masaüstünde solda */}
        <a
          href={getWixLandingUrl(slug)}
          className="absolute right-4 left-auto top-4 z-20 inline-flex min-h-[48px] min-w-[48px] touch-manipulation items-center justify-center gap-2 rounded-xl border border-amber-700/50 bg-amber-950/80 px-4 py-2.5 text-base font-medium text-amber-200 shadow-lg backdrop-blur-sm transition-colors hover:border-amber-600/60 hover:bg-amber-900/70 hover:text-amber-100 active:scale-[0.98] sm:right-auto sm:left-6 sm:top-6 sm:min-h-[44px] sm:px-4"
          aria-label={t.intro.back}
        >
          <span className="text-xl leading-none" aria-hidden>←</span>
          <span>{t.intro.back.replace(/^←\s*/u, "")}</span>
        </a>

        {/* Mobil: görsel üstte, metin altta kaydırılabilir. Masaüstü: görsel sol, metin sağ. */}
        <div className="grid h-full min-h-0 grid-rows-[minmax(0,35vh)_1fr] md:grid-cols-[1.4fr_1fr] md:grid-rows-1 lg:grid-cols-[1.6fr_1fr]">
          {/* Görsel: mobilde üstte, masaüstünde solda */}
          <div className="relative order-1 min-h-0 shrink-0 md:order-1 md:h-full md:min-h-0">
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

          {/* Metin: mobilde altta kaydırılabilir, masaüstünde sağda */}
          <div className="order-2 flex min-h-0 min-w-0 flex-col overflow-y-auto overflow-x-hidden bg-gradient-to-b from-amber-950/80 via-amber-950/60 to-amber-950/90 md:order-2 md:h-full">
            <div className="flex min-h-0 flex-1 flex-col px-4 py-6 sm:px-5 sm:py-8">
              <h1 className="mb-3 text-2xl font-bold tracking-tight text-amber-100 sm:text-3xl md:text-4xl">
                {game.title}
              </h1>

              <div className="mb-4 sm:mb-5">
                {introAudioUrl ? (
                  <div className="rounded-lg border border-amber-700/40 bg-amber-900/30 px-3 py-2.5">
                    <p className="mb-2 text-sm font-medium text-amber-200/90">{t.intro.audio}</p>
                    <audio
                      controls
                      src={encodeURI(introAudioUrl)}
                      className="h-10 w-full max-w-md"
                      preload="metadata"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-amber-700/40 bg-amber-900/30 px-3 py-2">
                    <span className="text-lg">🔊</span>
                    <span className="text-sm text-amber-200/80">{t.intro.audio}</span>
                  </div>
                )}
              </div>

              <section className="mb-5">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-400/90 sm:text-base">
                  {t.intro.story}
                </h2>
                <div className="whitespace-pre-line text-base leading-relaxed text-amber-100/90 sm:text-base">
                  {game.story}
                </div>
              </section>

              <section className="mb-5">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-400/90 sm:text-base">
                  {t.intro.rules}
                </h2>
                <ul className="list-inside list-disc space-y-1.5 text-base leading-relaxed text-amber-100/90 sm:text-base">
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
