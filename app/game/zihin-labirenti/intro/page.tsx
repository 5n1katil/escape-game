import { getGameBySlug, getWixLandingUrl, type GameConfig } from "@/data/games";
import { getThemeUi } from "@/lib/gameVisualTheme";
import { getTranslations } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import IntroStartButton from "../../[slug]/intro/IntroStartButton";
import { ZIHIN_LABIRENTI_SLUG } from "../constants";

export default async function ZihinLabirentiIntroPage() {
  const slug = ZIHIN_LABIRENTI_SLUG;
  const game = getGameBySlug(slug);
  const t = getTranslations();

  if (!game) notFound();

  const g = game as GameConfig;
  const skin = getThemeUi(g.visualTheme);
  const introUi = skin.intro;

  const coverImagePath = g.introCoverImagePath ?? null;

  const introAudioUrl =
    typeof g.introAudioUrl === "string" ? g.introAudioUrl : null;

  return (
    <div className="relative h-screen overflow-hidden bg-zinc-950">
      <main className="relative z-10 h-full">
        <a
          href={getWixLandingUrl(slug)}
          className={`absolute right-4 left-auto top-4 z-20 inline-flex min-h-[48px] min-w-[48px] touch-manipulation items-center justify-center gap-2 px-4 py-2.5 text-base font-medium shadow-lg backdrop-blur-sm sm:right-auto sm:left-6 sm:top-6 sm:min-h-[44px] sm:px-4 ${introUi.backButton}`}
          aria-label={t.intro.back}
        >
          <span className="text-xl leading-none" aria-hidden>
            ←
          </span>
          <span>{t.intro.back.replace(/^←\s*/u, "")}</span>
        </a>

        <div className="grid h-full min-h-0 grid-rows-[minmax(0,35vh)_1fr] md:grid-cols-[1.4fr_1fr] md:grid-rows-1 lg:grid-cols-[1.6fr_1fr]">
          <div className="relative order-1 min-h-0 shrink-0 md:order-1 md:h-full md:min-h-0">
            <div className="absolute inset-0 bg-zinc-950">
              {coverImagePath ? (
                <img
                  src={coverImagePath}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-9xl opacity-40">
                  {g.visualTheme === "cyber" ? "🧠" : "🏛️"}
                </span>
              )}
            </div>
          </div>

          <div
            className={`order-2 flex min-h-0 min-w-0 flex-col overflow-y-auto overflow-x-hidden md:order-2 md:h-full ${introUi.panelGradient}`}
          >
            <div className="flex min-h-0 flex-1 flex-col px-4 py-6 sm:px-5 sm:py-8">
              <h1 className={`mb-3 sm:text-3xl md:text-4xl ${introUi.h1}`}>
                {g.title}
              </h1>

              <div className="mb-4 sm:mb-5">
                {introAudioUrl ? (
                  <div className={introUi.audioBox}>
                    <p className={introUi.audioLabel}>{t.intro.audio}</p>
                    <audio
                      controls
                      src={encodeURI(introAudioUrl)}
                      className="h-10 w-full max-w-md"
                      preload="metadata"
                    />
                  </div>
                ) : (
                  <div
                    className={`flex items-center gap-2 px-3 py-2 ${introUi.audioRow}`}
                  >
                    <span className="text-lg">🔊</span>
                    <span className={introUi.audioRowText}>{t.intro.audio}</span>
                  </div>
                )}
              </div>

              <section className="mb-5">
                <h2 className={`mb-2 sm:text-base ${introUi.sectionHeading}`}>
                  {t.intro.story}
                </h2>
                <div className={introUi.bodyText}>{g.story}</div>
              </section>

              <section className="mb-5">
                <h2 className={`mb-2 sm:text-base ${introUi.sectionHeading}`}>
                  {t.intro.rules}
                </h2>
                <ul className={introUi.rulesList}>
                  {g.rules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </section>

              <div className="mt-auto pt-4">
                <Suspense
                  fallback={
                    <div className="h-14 w-full animate-pulse rounded-lg bg-zinc-800/50" />
                  }
                >
                  <IntroStartButton
                    slug={slug}
                    durationSeconds={g.durationMinutes * 60}
                    firstRoomId={1}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
