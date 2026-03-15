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
  /** Hikâye bölümünde gösterilecek görseller (papirüs, duvar vb.). */
  storyImages?: { url: string; alt?: string }[];
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
    audioSrc: "/games/tapinagin-laneti/audio/3-seslendirme 1. oda.mp3",
    media: [
      { url: "", alt: "Çakal başlı figür" },
      { url: "", alt: "Güneş diski ve bir kobra" },
      { url: "", alt: "Bir piramit ve nehir" },
      { url: "", alt: "Bir çift açılmış el" },
    ],
  },
  {
    id: 2,
    title: "2. Oda: Akrep Kral'ın Mezarı",
    description: "Tapınağın 2. Odası",
    type: "imageChoice",
    question:
      "Lahitteki yazıta göre doğru objeyi seçerek mezarın kapısını açın.",
    answer: "2",
    hint: "Yazıtta 'benim armağanımı sunan' diyor – Kral'ın kimliğini taşıyan obje.",
    story:
      "Kapı ağır bir gürültüyle arkamdan kapandı. İçeriye keskin, sıcak ve kuru bir hava yayıldı. Kum, her adım attığımda hafifçe hareket ediyor, sanki ayaklarımın altında yaşıyormuş gibi bir his veriyordu. Odanın merkezinde, büyük bir taş lahit duruyordu. Üzerine kazınmış figürlerden, buranın Akrep Kral'a ait olduğu açıktı.\n\nDuvarlarda, devasa akreplerin ve firavun giysileri giymiş bir adamın tasvirleri dikkatimi çekti. Adam, elinde bir asa tutuyor, önünde diz çöken halkı ona saygı gösteriyordu. Fakat biraz ileride, aynı adam tahtında otururken bir akrep tarafından sokuluyor ve karanlık bir varlığa dönüşüyordu.\n\nLahitin kapağında derin kazınmış eski bir yazıt vardı: \"Bana ait olanı çalmak isteyen, ölümün zehrini tatmalı. Yalnızca benim armağanımı sunan, mezarımın kapısını açabilir.\"\n\nBiraz ileride, duvarın hemen önünde, üç farklı obje duruyordu:\n\n1️⃣ Altın bir asa – Üzerinde akrep kabartmaları olan, işlemeli bir asa.\n\n2️⃣ Bir hançer – Kavisli ve sivri ucu olan eski bir Mısır hançeri.\n\n3️⃣ Taş bir mühür – Üzerinde Akrep Kral'ın ismi hiyerogliflerle işlenmiş küçük bir mühür.\n\nDoğru objeyi seçmek zorundaydım. Duvarlardan yükselen fısıltılar eğer yanlış seçersem… odanın kumlarla dolacağını ve beni burada hapsedeceğini söylüyordu...",
    puzzlePrompt:
      "Doğru objeyi seçerek mezarın sırrını çöz!",
    audioSrc: "/games/tapinagin-laneti/audio/4-2. oda seslendirme yeni.mp3",
    media: [
      { url: "", alt: "Altın Asa" },
      { url: "", alt: "Antik Mısır Hançeri" },
      { url: "", alt: "Taş Mühür" },
    ],
  },
  {
    id: 3,
    title: "3. Oda: Hiyerogliflerin Sırrı",
    description: "Tapınağın 3. Odası",
    type: "text",
    question:
      "Papirüsteki sembollerle duvardaki sembolleri eşleştirip şifreyi çözün. Bulduğunuz kelimeyi aşağıya yazın.",
    answer: "lanetibozangerçeğigörür",
    hint: "Sembollerin karşılık geldiği harfleri bularak anlamlı bir kelime oluşturun.",
    story:
      "Kapı arkamdan ağır bir gürültüyle kapandı. Oda, önceki odalara göre daha dardı ve havası biraz daha ağırdı. Duvarlar baştan sona hiyerogliflerle kaplıydı, ama bazı semboller diğerlerinden daha farklı görünüyordu. Sanki zaman onları silmeye çalışmış ama bir güç onları korumuş gibiydi. İçeride yankılanan tuhaf bir sessizlik vardı. Ne bir rüzgârın uğultusu ne de uzaktan gelen bir ses… Sadece bu antik yazıtların sessiz çığlıkları.\n\nKöşede yere bırakılmış, zamanın etkisiyle kırılganlaşmış eski bir papirüs rulosu gözüme çarptı. Onu dikkatlice açtığımda, karmaşık semboller ve tanıdık görünen harflerle yazılmış bir şifre gördüm. Ama bu semboller dağınık haldeydi, mantıklı bir sıraya girmiyordu. Bir şeyler eksikti. Belki de doğru sıralamayı bulmam gerekiyordu.\n\nDuvarlardaki farklı semboller dikkatimi çekti. Diğerlerinden daha derindi ve ışık vurdukça hafifçe parlıyordu. Sanki bana bir şey anlatmaya çalışıyorlardı. Aynı sembolleri papirüste de gördüm, ancak buradaki sıralama farklıydı. Bu bir koddu. Eğer bu sembollerin hangi harfe karşılık geldiğini anlayabilirsem, belki de odanın çıkış kapısını açacak kelimeleri bulabilirdim. Ama bir hata yaparsam… bu tapınağın bana sunacağı cezanın ne olacağını bilmiyordum.",
    puzzlePrompt:
      "Şifreyi çözüp bulduğunuz kelimeyi aşağıdaki alana yazın.",
    audioSrc: "/games/tapinagin-laneti/audio/5-3. oda seslendirme yeni.mp3",
    storyImages: [
      { url: "/games/tapinagin-laneti/images/papirüs.png", alt: "Papirüs üzerinde semboller ve harfler" },
      { url: "/games/tapinagin-laneti/images/12.png", alt: "Duvarda parlayan hiyeroglif semboller" },
    ],
  },
  {
    id: 4,
    title: "4. Oda: Firavunun Laneti",
    description: "Tapınağın 4. Odası",
    type: "text",
    question:
      "Taş levhadaki yazıya göre papirüslerdeki sembolleri çözüp doğru ismi bulun. Bulduğunuz ismi aşağıya yazın.",
    answer: "çocukkraltutankhamun",
    hint: "Ölüler huzur içinde yatmaz, ismi unutulan sonsuza dek kaybolur – papirüsteki şifreyi çözerek ismi bulun.",
    story:
      "Kapı arkamdan ağır bir gürültüyle kapandı. Burası, önceki odalardan daha büyük ve daha ürkütücüydü. Havanın içinde eski papirüslerin tozlu kokusu ve hafif bir rutubet vardı. Ortam loştu, yalnızca duvarlara monte edilmiş eski meşaleler titrek bir ışık yayıyordu. Duvarlar tamamen hiyerogliflerle kaplıydı, ancak diğer odalardan farklı olarak burada bazı hiyeroglifler ters çizilmiş ya da kazınmış gibi duruyordu. Sanki bir şey saklamak ya da gizlemek için özellikle böyle işlenmişlerdi.\n\nTam karşımdaki duvarda, devasa bir firavun tasviri vardı. Firavunun gözleri, üzerime bakıyormuş gibi hissettiriyordu. Ellerinde tuttuğu bir anahtar, belki de odanın sırrını açıklıyordu. Ama gözlerimi firavunun altına kaydırdığımda kazınmış eski bir yazı gördüm. Taş levhada şu kelimeler vardı: \"Ölüler huzur içinde yatmaz, ismi unutulan sonsuza dek kaybolur.\" Bu cümle kafamı kurcaladı. Belli ki burada bulunması gereken bir isim vardı.\n\nOdanın merkezinde, yerde 2 tane eski papirüs parçası buldum, üstünde karmaşık semboller vardı. Papirüslerin altında yerde eski Mısır tanrılarını simgeleyen semboller kazınmıştı. Ama bunlardan yalnızca biri doğruydu. Eğer yanlış ismi seçersem, Firavunun lanetini üzerime çekebilirdim. Şimdi papirüslerdeki sembolleri dikkatlice incelemeliyim. Doğru ismi bulamazsam, bu tapınağın lanetinin kurbanı olmaktan kaçamayacağım…",
    puzzlePrompt:
      "Papirüslerdeki şifreli sembolleri çözüp doğru ismi bulun ve aşağıdaki alana yazın.",
    audioSrc: "/games/tapinagin-laneti/audio/6-4. oda seslendirme yeni.mp3",
    storyImages: [
      { url: "/games/tapinagin-laneti/images/şifreli semboller-2.png", alt: "Şifreli semboller – anahtar" },
      { url: "/games/tapinagin-laneti/images/şifreli semboller.png", alt: "Şifreli semboller – papirüs (şifreli mesaj)" },
    ],
  },
  {
    id: 5,
    title: "5. Oda: Çölün Kum Saati",
    description: "Tapınağın 5. Odası",
    type: "text",
    question:
      "Duvar ve papirüsteki sayılar ile okları kullanarak şifreyi çözün. Kum saatinin mesajına göre bulduğunuz kelimeyi aşağıya yazın.",
    answer: "geçmişinizleri",
    hint: "Lanet geri sayıyor, yalnızca zamanı doğru okuyan kurtulabilir – sayı ve okları alfabe tablosuyla eşleştirin.",
    story:
      "Kapı arkamdan büyük bir gürültüyle kapandığında, odanın ortasında duran kum saatinin içindeki taneler hızla akmaya başladı. Kumun sesi, odayı dolduran tek sesti; ince, düzenli ve durdurulamaz bir fısıltı gibi... Oda önceki odalara benzemiyordu. Burada ne heykeller vardı ne de tanıdık figürler. Duvarlar, rastgele yerleştirilmiş gibi görünen sayılar, oklar ve tuhaf işaretlerle kaplıydı. Bazı sayılar büyüktü ve öne çıkıyordu, bazıları ise neredeyse silinmiş gibiydi.\n\nKöşeyi döndüğümde sağ duvarda, kum saati figürleri ile çevrelenen büyük bir çerçeve içerisindeki harfler dikkatimi çekti. Çerçevenin ortasında alfabe ve alfabenin en sol üstünde anlamlandıramadığım bir başlangıç noktası vardı. Duvarın hemen önünde yerde yırtık bir papirüs kağıdı buldum. Burada bir şifrenin gizlendiği açıktı. Ok sembolleri ve sayılar bana bir şey anlatmaya çalışıyor gibiydi, kafam karıştı zaman daralıyordu.\n\nArkamı döndüğümde, kum saatinin cam yüzeyine yansımış bir yazı fark ettim. Ancak yazı sabit değildi; kumlar aktıkça kelimeler de şekil değiştiriyordu. Gözlerimi kıstım ve bir anlığına cümlenin tamamını okuyabildim:\n\n\"Lanet geri sayıyor, yalnızca zamanı doğru okuyan kurtulabilir.\"\n\nOda her geçen saniye daralıyormuş gibi hissettim. Kum saati, yalnızca zamanı değil, benim kaderimi de ölçüyordu. Kumların son tanesi düştüğünde ne olacağını bilmiyordum, ama tek bir şey kesindi… Buradan çıkmak için zamanın dilini anlamalıydım..",
    puzzlePrompt:
      "Sayı ve okları alfabe tablosuyla eşleştirip şifreyi çözün. Bulduğunuz kelimeyi aşağıdaki alana yazın.",
    audioSrc: "/games/tapinagin-laneti/audio/7-5. oda seslendirme yeni.mp3",
    storyImages: [
      { url: "/games/tapinagin-laneti/images/Kum saati figürlü duvar.png", alt: "Kum saati figürlü duvar – alfabe tablosu" },
      { url: "/games/tapinagin-laneti/images/sayılar ve oklar.png", alt: "Sayılar ve oklar – papirüs şifresi" },
    ],
  },
  {
    id: 6,
    title: "6. Oda: Sonsuzluğun Kapısı",
    description: "Tapınağın 6. Odası",
    type: "imageChoice",
    question:
      "Taş kaidedeki yazıya göre teraziyi dengeleyecek doğru sembolü seçin.",
    answer: "2",
    hint: "Ruhu hafif olan geçer – Terazi ruhun ağırlığını ölçer. Adalet ve hakikati simgeleyen sembol.",
    story:
      "Kapı arkamdan ağır bir gürültüyle kapandı. İçeriye ince bir ışık huzmesi süzülüyordu, burası diğer odalar gibi karanlık ve kasvetli değildi. Tam karşıda, yüksek tavanın en tepesinden içeri süzülen altın sarısı güneş ışınları bir noktayı aydınlatıyordu: Devasa bir taş kapıyı. Kapının üzerinde, bir çift göz sembolü ve güneş diski işlenmişti. Duvarlardaki hiyeroglifler ise sanki bir sonun değil, bir başlangıcın hikayesini anlatıyordu. Ama kapıya ulaşmak kolay olmayacaktı. Odanın ortasında, firavunların yargılanma sahnesini hatırlatan devasa bir taş terazi duruyordu. Bir kolu yukarıda, diğeri aşağıdaydı. Denge bozuktu.\n\nTerazinin önünde, eski taş bir kaide vardı. Üzerine oyulmuş yazı hala okunabiliyordu:\n\n\"Ölçülen güç değil, gerçektir, gözler bazen yanıltır, ışığı taşıyan değil, ruhu hafif olan geçer...\n\nTerazi, adaleti değil, ruhun ağırlığını ölçer.\nÜstüne fazla yük binen düşer, eksik olan kaybolur.\nYolunu bulan, ancak dengeyi sağlayandır.\"\n\nTaş kaidenin üstünde terazinin hemen önüne yerleştirilmiş dört farklı taş sembol vardı. Belli ki doğru olanı terazinin boş kefesine koymalıydım.\n\nAma hangisi?\n\n1️⃣ Kapalı Göz – Bilinmeyeni, gizemi ve unutulmuş sırları işaret ediyordu.\n\n2️⃣ Kurt Başlı Asa – Firavunların gücünü temsil ediyordu.\n\n3️⃣ Tüy – Maat'ın adaleti ve hakikati simgeliyordu.\n\n4️⃣ Güneş Taşı – Sonsuz yaşam ve ilahi ışıkla ilişkilendiriliyordu.\n\nEtrafıma bakındım. Çok yaklaştığımı hissediyordum, kalbim çok hızlı atmaya başladı. Kapının üzerindeki gözler sanki bana bakıyordu. Tapınağın laneti özgürlüğümü istiyordu, gücümü toparladım ve odaklandım... Şimdi seçim yapmalıyım...",
    puzzlePrompt:
      "Hangi sembol teraziyi dengeleyecek? Doğru sembolü seçin.",
    audioSrc: "/games/tapinagin-laneti/audio/8-6. oda seslendirme yeni.mp3",
    media: [
      { url: "", alt: "Kapalı Göz" },
      { url: "", alt: "Kurt Başlı Asa" },
      { url: "", alt: "Tüy" },
      { url: "", alt: "Güneş Taşı" },
    ],
  },
];
