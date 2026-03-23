/**
 * Game metadata. Auth/payment gate will be inserted before intro in the route flow.
 */
import { rooms } from "./rooms";
import { zihinLabirentiRooms } from "./zihinLabirenti";

/** Wix promo page; intro "Geri" goes here. */
export const WIX_LANDING_BASE = "https://www.5n1dedektif.com";

/** Dedicated route exclusions for dynamic `[slug]` SSG list. */
export const GAME_SLUGS_WITH_DEDICATED_ROUTES: readonly string[] = [];

export type VisualThemeId = "temple" | "cyber";

export type GameConfig = {
  slug: string;
  title: string;
  wixLandingUrl?: string;
  story: string;
  rules: readonly string[];
  durationMinutes: number;
  roomCount: number;
  finalCode: string;
  endStoryLong: string;
  endAudioUrl?: string;
  endImageUrl?: string;
  endGizemMalikanesiUrl?: string;
  endGizemMalikanesiLabel?: string;
  introAudioUrl?: string;
  hubStory: string;
  hubStoryAudioUrl?: string;
  /** Tapınak amber / Siber temalı oyunlar (cyan-neon) */
  visualTheme: VisualThemeId;
  /** Hub + oda ekranı harita görseli */
  mapImagePath: string;
  /** Intro sol panel kapak görseli; yoksa placeholder */
  introCoverImagePath?: string | null;
};

export const games = [
  {
    slug: "tapinagin-laneti",
    title: "Tapınağın Laneti",
    wixLandingUrl: "https://www.5n1dedektif.com/tap%C4%B1na%C4%9F%C4%B1n-laneti",
    story:
      "Ben, 5N1Dedektiflik bürosu uzman dedektifiyim. Olağanüstü vaka ve davaları çözme konusundaki yeteneklerimle tanınırım ve şimdiye kadar birçok gizemi aydınlattım. Ancak bu sefer karşılaştığım gizem, bildiğim her şeyin ötesinde. Birkaç hafta önce gelen şifreli bir mesaj beni, kadim bir uygarlığın izlerini taşıyan bir tapınağa sürükledi. Anlatılanlara göre, buraya giren hiç kimse geri dönmemişti. Tapınak, efsanelere göre sonsuz bir lanetin yuvasıydı; içeri girenleri dışarı çıkarmamak için lanetlenmişti!  İçeri girdiğimde devasa taş kapı arkamdan kapandı ve kaçış yolum kalmadı. Burada hapsolmuş durumdayım. Önümde altı farklı oda var ve her biri geçmişin sırlarını saklıyor. Kaçabilmem için her odadaki bulmacaları çözmem, ipuçlarını bir araya getirmem gerekiyor. Zamanım sınırlı, eğer sadece 60 dakika içerisinde tüm odaları geçerek tapınağın derinliklerinde gizlenen son anahtarı bulamazsam, sonsuza kadar bu lanetin içinde sıkışıp kalacağım...",
    rules: [
      "Oyuna başlamadan önce kağıt ve kaleminizi hazırlayın.",
      "Tapınak haritasındaki odaları sırasıyla ziyaret edin.",
      "Her odada çözülmesi gereken bir gizem sizi bekliyor. Öncelikle odadaki metni detaylıca okuyun ya da sesli bir şekilde dinleyin.",
      "Bulmaca ya da şifreyi çözümledikten sonra sıradaki odaya giriş yapabileceksiniz.",
      "6. ve son odaya geldikten sonra elde ettiğiniz şifre ile tapınaktan kaçabilirsiniz.",
      "Fakat bütün bunları başarmak için sadece 1 saat süreniz olduğunu unutmayın!",
    ],
    durationMinutes: 60,
    roomCount: rooms.length,
    finalCode: "lanetlitapınağıngizemi",
    endStoryLong:
      "Terazinin taş kolları gıcırdayarak hareket etti... Denge sağlanmıştı. Sonsuzluğun Kapısı önümde yavaşça açılırken, güneş ışığı loş tapınak duvarlarına vurdu. Sırtımdan aşağı soğuk bir ter damladı. Bitti mi, Yoksa daha yeni mi başlıyor diye düşündüm. Bir adım attım. Toz kokusunun yerini temiz hava aldı. Gözlerim kamaştı, bedenim hafifledi. Tapınaktan çıktığımda gökyüzünü gördüm. Özgürdüm. Ama içimde bir şeyler hâlâ oturmuyordu. Bu kadar kolay olmamalıydı. Kapı aniden büyük bir gürültüyle kapandı. Sanki hiçbir zaman açılmamış gibi, antik taşlar yerine oturdu. Ve işte o an… Her yer titremeye başladı, deprem mi oluyordu, anlayamadım. Gökyüzü birden simsiyah oldu, toprak yarılmaya başladı, ve boşluktan aşağı doğru düşmeye başladım, sonsuzluğa doğru süzülerek... Gözlerimi açtığımda, bir anda her şey değişmişti. Masa lambasının soluk ışığı gözlerimi kamaştırdı. Sert bir yüzeye dayalıydım, başım zonkluyordu resmen. Elimde bir kalem vardı, önümde eski dava dosyaları… Başımı kaldırdım. Burası… ofisimdi. Ofisimdeydim. Önümde açık duran, sayfaları dağılmış Gizem Malikanesi Davası'nın dosyaları bana bakıyordu. Günlerdir eve gitmemiş, gözümü bile kırpmadan çalışmıştım. Anlaşılan dosyaların üzerinde uyuyakalmıştım. Bir an durdum. Gördüğüm her şey… Tapınak, bilmeceler, lanet… sadece bir rüyaydı. Ama ya değilse? Ellerim titriyordu. Her şey o kadar gerçek hissettirmişti ki… Dosyalardan birini çektim. Gizem Malikanesi'ndeki cinayetin krokisi önümdeydi. Kurbanın bedeni, saatler önce üzerinde çalıştığım terazi figürüne benziyordu. Bir anda içim ürperdi. Bu bir oyun muydu? Zihnim bana bir ipucu mu veriyordu? Ve o an fark ettim. Bingo. Katili bulmuştum...",
    endAudioUrl: "/games/tapinagin-laneti/audio/9-Tapınağın Laneti Oyun Sonu Seslendirme.mp3",
    endImageUrl: "/games/tapinagin-laneti/images/Tapınağın Laneti Çıkış.png",
    endGizemMalikanesiUrl: "https://www.5n1dedektif.com/gizemmalikanesi",
    endGizemMalikanesiLabel: "DAVA02 Gizem Malikanesi'ne git!",
    introAudioUrl: "/games/tapinagin-laneti/audio/1-Tapınak Girişi Seslendirme.mp3",
    hubStory:
      "Zifiri karanlık koridorun girişinde duruyorum. Hava ağır, sıcak ve kuru... Sanki yüzyıllardır burada hapsolmuş bir lanetin nefesini hissediyorum. Tozlu taş duvarlara dokunduğumda, parmaklarımın arasından ince kumlar dökülüyor. Sanki bu tapınak, zamanın içinde eriyip gitmiş ama beni bekliyormuş gibi.\n\nEfsaneler, buranın lanetli olduğunu söylüyor. Kaybolmuş bir firavunun, gömüldüğü yerin sonsuza dek mühürlenmesi için bir büyü yaptığını... İçeriye girenlerin asla geri dönemediğini... Yalnızca bütün sırları çözenler buradan sağ çıkabilirmiş.\n\nFakat bu bir masal değil. Önümde, taş bloklara kazınmış eski Mısır yazıları, bana sanki bir şeyler fısıldıyor. Arkamdaki giriş, içeri adım attığım anda büyük bir gürültüyle kapandı. Artık geri dönüş yok.\n\nYolumun üzerindeki altı odanın her biri bir sınav olacak. Kapılar, sadece doğru cevapları bulanlara açılacak. Eğer yanlış yaparsam... Efsanelerin söylediği gibi, bu tapınağın bir parçası olup kalacağım.\n\nDerin bir nefes alıyorum. Gözlerimi karanlığa dikiyorum. Bu benim bugüne kadar ki en zor sınavım... Ya tapınağın sırlarını çözüp kurtulacağım ya da bu lanetin bir parçası olacağım.",
    hubStoryAudioUrl: "/games/tapinagin-laneti/audio/2-Tapınağın Laneti Giriş Seslendirme.mp3",
    visualTheme: "temple",
    mapImagePath: "/games/tapinagin-laneti/images/temple-map.jpg",
    introCoverImagePath:
      "/games/tapinagin-laneti/images/" + encodeURIComponent("Tapınağın Laneti.png"),
  },
  {
    slug: "zihin-labirenti",
    title: "Zihin Labirenti: Son Veri",
    wixLandingUrl: `${WIX_LANDING_BASE}/zihin-labirenti`,
    story:
      "Prof. Dr. Erhan Sivrizeka’nın bilinci, nöral arayüz deneyiyle dijital bir sisteme aktarıldı. Ben, bu labirentin içine düşen bir operatörüm: onun hafıza fragmentleri ve sınır katmanları arasında ilerliyorum. Altı modül—altı oda—her biri zihnin farklı bir işlem katmanını temsil ediyor. Süre dolmadan çıkış protokolünü tamamlamazsam, veri akışına gömülüp kaybolacağım.",
    rules: [
      "Oyuna başlamadan önce kağıt ve kaleminizi hazırlayın.",
      "Haritadaki modülleri sırayla ziyaret edin.",
      "Her modülde görev metni ve seçenekler yer alır; önce metni okuyun.",
      "Doğru yanıtla bir sonraki modülün kilidi açılır.",
      "Tüm modüller tamamlandıktan sonra ana çıkış kodunu girin.",
      "Toplam süreniz 60 dakikadır.",
    ],
    durationMinutes: 60,
    roomCount: zihinLabirentiRooms.length,
    finalCode: "ebedi",
    endStoryLong:
      "Son veri paketi ekranda çözüldü. Sinyal gürültüsü kesildi; terminal loşlaştı. Sivrizeka’nın dijital izi silindi mi, yoksa başka bir sunucuda mı kopyalandı—bilmiyorum. Çıkış kapısı açıldı. Gerçek dünya soğuk ve netti. Şimdilik… özgürüm.",
    hubStory:
      "Koyu lacivert bir koridor, tavanda akan cyan veri hatları. Bu yer nörobilim laboratuvarı ile siber uzayın arasında; Sivrizeka’nın zihninin haritası gibi.\n\nAltı modül sıralı görünüyor. Yanlış dallanma beni izole edebilir; doğru sıra ve yanıtlarla ilerlemeliyim.\n\nGeri dönüş kapısı kilitlendi. Tek çıkış: tüm modülleri çözmek.",
    visualTheme: "cyber",
    mapImagePath: "/games/zihin-labirenti/images/zihin-map.jpg",
    introCoverImagePath: "/games/zihin-labirenti/images/cover.jpg",
  },
] as const satisfies readonly GameConfig[];

/** Dinamik `[slug]` segmenti için SSG param listesi. */
export function getSlugsForDynamicGameSegment(): { slug: string }[] {
  return games
    .filter((g) => !GAME_SLUGS_WITH_DEDICATED_ROUTES.includes(g.slug))
    .map((g) => ({ slug: g.slug }));
}

export type Game = (typeof games)[number];

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

/** Intro back button: Wix promo page for this game. */
export function getWixLandingUrl(slug: string): string {
  const game = getGameBySlug(slug);
  return game?.wixLandingUrl ?? `${WIX_LANDING_BASE}/${slug}`;
}

export function getRoomsForGame(slug: string) {
  if (slug === "tapinagin-laneti") return rooms;
  if (slug === "zihin-labirenti") return zihinLabirentiRooms;
  return [];
}
