/**
 * Room puzzle data. Save this file as UTF-8.
 * Multi-format puzzle engine - each room has a type and type-specific fields.
 */
export const ROOM_TYPES = [
  "text",
  "multipleChoice",
  "imageChoice",
  "objectFind",
  "videoPuzzle",
] as const;

export type RoomType = (typeof ROOM_TYPES)[number];

export interface Room {
  id: number;
  title: string;
  description: string;
  type: RoomType;
  question: string;
  answer?: string;
  hint?: string;
  options?: string[];
  media?: { url: string; alt?: string }[];
  /** Oda hikâye / atmosfer metni. Yoksa description kullanılır. */
  story?: string;
  /** Bilmece yönlendirme metni. Yoksa question kullanılır. */
  puzzlePrompt?: string;
  /** Oda ses dosyası yolu (varsa ses oynatıcı gösterilir). */
  audioSrc?: string;
}

export const rooms: Room[] = [
  {
    id: 1,
    title: "1. Oda: Anubis'in Laneti",
    description: "Tapınağın 1. Odası",
    type: "imageChoice",
    question:
      "Bu odada laneti temsil eden doğru sembolü seçerek ilerleyin.",
    answer: "0",
    hint: "Ölüm ve öbür dünya tanrısıyla ilişkili sembol.",
    story:
      "Kapı ardımdan büyük bir gürültüyle kapandı. İçeriye kuru ve soğuk bir hava yayıldı. Tapınağın havasında eski zamanlardan kalma bir fısıltı vardı, sanki binlerce yıldır burada yankılanan sesler hâlâ taşların arasında gizleniyordu. Önümde, ölülere öbür dünyaya geçişlerinde rehberlik eden tanrı Anubis'in devasa bir heykeli yükseliyordu. Heykelin gözleri benim üzerimdeymiş gibi tuhaf bir hisse kapıldım.\n\nOdanın aydınlığına gözlerim alıştıkça tüm duvarları kaplayan figürlerin detayları dikkatimi çekmeye başladı.\n\nSol duvarda, bir adamın büyük bir kapının önünde durduğu tasvir edilmişti. Arkasında uzun bir gölge uzanıyordu ve hemen yanında başı yukarı kalkmış çakal başlı bir figür bulunuyordu. Adamın eli, kapının eşiğine uzanmıştı ama açıp açmayacağı belirsizdi.\n\nDiğer duvarda, güneşin altında kıvrılan bir kobra çizilmişti. Altında diz çökmüş insanlar ona tapıyordu.\n\nÜçüncü duvarda, bir nehrin kenarında durmuş bir adam betimlenmişti. Adam, nehrin diğer tarafına geçmek ister gibi duruyordu. Fakat su akışkan değildi, sanki taş gibi sert ve hareket etmiyordu.\n\nSon duvarda, ellerini yukarı kaldırmış bir figür yer alıyordu sanki dua ediyor ya da hayatı için yalvarıyordu.\n\nTam karşımdaki taş levhaya kazınmış eski yazılar vardı. Zamanla aşınmış olsa da, hâlâ bazı kelimeler okunabiliyordu:\n\n\"Ölüler diyarına adım atan, yalnız yürümez. Gölgesiz olan yolu bulamaz. Gölgeyle yürüyen kapıyı açar. Yükselenler değil, yol gösterenler geçebilir.\"\n\nBu cümle kafamı kurcaladı. Gölgeyle yürüyen mi?\n\nOdanın ortasında, yere gömülü dört taş plaka vardı. Her birinin üzerinde bir sembol kazılıydı:\n\n1️⃣ Çakal başlı bir figür\n2️⃣ Güneş diski ve bir kobra\n3️⃣ Bir piramit ve nehir\n4️⃣ Bir çift açık el\n\nOdanın içinde yankılanan sessizliğe kulak verdim. Burası, ölümün ve yeniden doğuşun kapısıydı. Yanlış seçimi yaparsam, bu tapınağın bir parçası olmaktan kaçamayacağımı hissediyordum.",
    puzzlePrompt:
      "Doğru sembolü seçerek kaçışı tamamla. Ölüm ve öbür dünyayla ilişkili olan figürü bul.",
    audioSrc: undefined,
    media: [
      { url: "", alt: "Çakal başlı figür" },
      { url: "", alt: "Güneş diski ve bir kobra" },
      { url: "", alt: "Bir piramit ve nehir" },
      { url: "", alt: "Bir çift açılmış el" },
    ],
  },
  {
    id: 2,
    title: "Kayıp Koridor",
    description:
      "Dar bir koridor. Duvarlarda eski yön işaretleri var. Hangi yöne gideceğinizi bilmelisiniz.",
    type: "text",
    question:
      "Pusulanın başlangıcı, dört yönden ilki. Koridorda hangi yöne gitmelisin?",
    answer: "kuzey",
    hint: "Yıldızların gösterdiği yön.",
  },
  {
    id: 3,
    title: "Firavun Odası",
    description:
      "Mısır temalı bir oda. Piramit resimleri ve hiyeroglifler duvarları süslüyor.",
    type: "text",
    question:
      "Sarı kuma gömülü, sargılarla sarılı. Bu odada ne saklanır?",
    answer: "mumya",
    hint: "Eski Mısır'da ölüler korunurdu.",
  },
  {
    id: 4,
    title: "Gizli Tünel",
    description:
      "Karanlık bir tünel. İlerleyebilmek için bir şey bulmalısınız.",
    type: "text",
    question: "Karanlığı yener, yolunu gösterir. Tünelde ne ararsın?",
    answer: "isik",
    hint: "Geceleri lamba veya fener ne sağlar?",
  },
  {
    id: 5,
    title: "Lanetli Hazine",
    description:
      "Altın paralar ve mücevherlerle dolu bir oda. Değerli bir hazine.",
    type: "text",
    question: "Parlak, sarı, değerli. Kralların sevdiği bu nedir?",
    answer: "altin",
    hint: "Para ve mücevher yapımında kullanılır.",
  },
  {
    id: 6,
    title: "Son Kapı",
    description:
      "Özgürlüğe açılan son kapı. Sadece doğru kelimeyle geçebilirsiniz.",
    type: "text",
    question: "Anahtarsız açılır, kilitsiz kapanır.",
    answer: "goz",
    hint: "İnsanın kendi bedeninde var.",
  },
];
