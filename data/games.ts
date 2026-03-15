/**
 * Game metadata. Auth/payment gate will be inserted before intro in the route flow.
 */
import { rooms } from "./rooms";

/** Wix promo page; intro "Geri" goes here. */
export const WIX_LANDING_BASE = "https://www.5n1dedektif.com";

export const games = [
  {
    slug: "tapinagin-laneti",
    title: "Tapınağın Laneti",
    wixLandingUrl: "https://www.5n1dedektif.com/tap%C4%B1na%C4%9F%C4%B1n-laneti",
    story:
      "Antik tapınak önünüzde yükseliyor; taş duvarları yüzyılların yağmuru ve gölgesiyle aşınmış. Efsane, gizli hazinesini arayanların üzerine konan bir lanetten bahseder—sadece akıllı ve cesur olanlar sağ çıkar.\n\nAğır kapıları itip açıyorsunuz. Toz loş ışıkta savruluyor. Saatiniz başlayacak. İpuçlarını bulun, bilmeceleri çözün ve zaman dolmadan laneti kırın.",
    rules: [
      "Her odada bir bilmece veya soru bulacaksınız.",
      "Cevabı küçük harfle, Türkçe karakter kullanmadan yazın (örn: güneş yerine gunes).",
      "60 dakikalık süreniz var.",
      "Yanlış cevap deneme sayınızı artırır.",
      "Tüm odaları çözerek tapınaktan kaçın.",
    ],
    durationMinutes: 60,
    roomCount: rooms.length,
    /** Final escape code entered on hub after all 6 rooms solved. */
    finalCode: "lanet",
    /** Uzun oyun sonu hikâyesi (sonuç ekranı sağ panel). */
    endStoryLong:
      "Taş kollar gıcırdadı, Sonsuzluk Kapısı açıldı. Taze havaya adım attınız—ta ki kapı çarparak kapandı ve sarsıntı her yeri sardı. Kendinizi bir boşlukta buldunuz; uyandığınızda bir ofisteydiniz. Tapınak deneyimi geride kalmıştı; Gizem Malikanesi Davası'ndaki ipuçları zihninizde yer etti. Katili bulmuştunuz.",
    /** Oyun sonu hikâye ses dosyası (varsa sağ panelde oynatıcı gösterilir). */
    endAudioUrl: undefined as string | undefined,
    /** Oyun sonu görseli (varsa sağ panel üstünde gösterilir). */
    endImageUrl: undefined as string | undefined,
  },
] as const;

export type Game = (typeof games)[number];

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

/** Intro back button: Wix promo page for this game. */
export function getWixLandingUrl(slug: string): string {
  const game = getGameBySlug(slug);
  return (game && "wixLandingUrl" in game ? game.wixLandingUrl : null) ?? `${WIX_LANDING_BASE}/${slug}`;
}

export function getRoomsForGame(slug: string) {
  if (slug === "tapinagin-laneti") return rooms;
  return [];
}
