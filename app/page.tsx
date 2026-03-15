/**
 * Root is not the main entry; Wix promo pages link to /game/[slug]/intro.
 * Kept as minimal fallback.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      <p className="text-center text-sm text-zinc-500">
        5N1Dedektif Escape Lab — Giriş Wix tanıtım sayfasından.
      </p>
    </div>
  );
}
