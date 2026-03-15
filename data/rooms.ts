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
      "Taş kapıyı açtığınızda loş bir odaya adım atıyorsunuz. Duvarlarda mumya bezleri ve hiyeroglifler var. Havada tütsü ve toz karışımı bir koku. Efsaneye göre bu tapınak, ölüleri koruyan bir tanrıya adanmış; onun laneti, yanlış seçim yapanları zamanın dışına hapsediyor. Odanın ortasında dört sembol taşıyorsunuz: biri çakal başlı bir figür, biri güneş diski ve kobra, biri piramit ve nehir, biri açılmış iki el. Laneti kırmak için bu odanın gerçek sahibini—ölüler diyarının bekçisini—temsil eden sembolü seçmelisiniz.",
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
