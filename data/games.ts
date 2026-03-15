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
      "Ben, 5N1Dedektiflik bürosu uzman dedektifiyim. Olağanüstü vaka ve davaları çözme konusundaki yeteneklerimle tanınırım ve şimdiye kadar birçok gizemi aydınlattım. Ancak bu sefer karşılaştığım gizem, bildiğim her şeyin ötesinde. Birkaç hafta önce gelen şifreli bir mesaj beni, kadim bir uygarlığın izlerini taşıyan bir tapınağa sürükledi. Anlatılanlara göre, buraya giren hiç kimse geri dönmemişti. Tapınak, efsanelere göre sonsuz bir lanetin yuvasıydı; içeri girenleri dışarı çıkarmamak için lanetlenmişti!  İçeri girdiğimde devasa taş kapı arkamdan kapandı ve kaçış yolum kalmadı. Burada hapsolmuş durumdayım. Önümde altı farklı oda var ve her biri geçmişin sırlarını saklıyor. Kaçabilmem için her odadaki bulmacaları çözmem, ipuçlarını bir araya getirmem gerekiyor. Zamanım sınırlı, eğer sadece 60 dakika içerisinde tüm odaları geçerek tapınağın derinliklerinde gizlenen son anahtarı bulamazsam, sonsuza kadar bu lanetin içinde sıkışıp kalacağım...",
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
    /** Giriş ekranı hikâye seslendirmesi (varsa intro sayfasında oynatıcı gösterilir). */
    introAudioUrl: "/games/tapinagin-laneti/audio/intro.mp3" as string | undefined,
    /** Lobi (hub) ekranında HİKAYE bölümünde gösterilecek metin. */
    hubStory:
      "Zifiri karanlık koridorun girişinde duruyorum. Hava ağır, sıcak ve kuru... Sanki yüzyıllardır burada hapsolmuş bir lanetin nefesini hissediyorum. Tozlu taş duvarlara dokunduğumda, parmaklarımın arasından ince kumlar dökülüyor. Sanki bu tapınak, zamanın içinde eriyip gitmiş ama beni bekliyormuş gibi.\n\nEfsaneler, buranın lanetli olduğunu söylüyor. Kaybolmuş bir firavunun, gömüldüğü yerin sonsuza dek mühürlenmesi için bir büyü yaptığını... İçeriye girenlerin asla geri dönemediğini... Yalnızca bütün sırları çözenler buradan sağ çıkabilirmiş.\n\nFakat bu bir masal değil. Önümde, taş bloklara kazınmış eski Mısır yazıları, bana sanki bir şeyler fısıldıyor. Arkamdaki giriş, içeri adım attığım anda büyük bir gürültüyle kapandı. Artık geri dönüş yok.\n\nYolumun üzerindeki altı odanın her biri bir sınav olacak. Kapılar, sadece doğru cevapları bulanlara açılacak. Eğer yanlış yaparsam... Efsanelerin söylediği gibi, bu tapınağın bir parçası olup kalacağım.\n\nDerin bir nefes alıyorum. Gözlerimi karanlığa dikiyorum. Bu benim bugüne kadar ki en zor sınavım... Ya tapınağın sırlarını çözüp kurtulacağım ya da bu lanetin bir parçası olacağım.",
    /** Lobi hikâye seslendirmesi (varsa hub HİKAYE bölümünde oynatıcı gösterilir). */
    hubStoryAudioUrl: undefined as string | undefined,
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
