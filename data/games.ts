/**
 * Game metadata. Auth/payment gate will be inserted before intro in the route flow.
 */
import { rooms } from "./rooms";

export const games = [
  {
    slug: "tapinagin-laneti",
    title: "Tapınağın Laneti",
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
  },
] as const;

export type Game = (typeof games)[number];

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

export function getRoomsForGame(slug: string) {
  if (slug === "tapinagin-laneti") return rooms;
  return [];
}
