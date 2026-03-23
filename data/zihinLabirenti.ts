/**
 * Zihin Labirenti: Son Veri — oda verileri ve mini-oyun puzzleType alanları.
 */
import type { Room } from "./rooms";

export const zihinLabirentiRooms: Room[] = [
  {
    id: 1,
    title: "1. Oda: Sisteme Giriş (Nöro-Boot)",
    description: "Zihin Labirenti — 1. modül: Kurucu Protokol (görselde gizli bir fragman saklı).",
    type: "multipleChoice",
    puzzleType: "multiple-choice",
    question:
      "Sistem Doğrulaması: Biyolojik yapıdan dijital formata geçişteki 'nihai hedefi' tanımlayan yetkilendirme protokolü hangisidir?",
    answer: "2",
    hint: "Profesörün projesinin adında ve amacında saklı: ölümsüzlük değil, süreklilik…",
    options: [
      "A) Bilişsel Klonlama",
      "B) Dijital Simülasyon",
      "C) Ebediyet",
      "D) Yapay Evrim",
    ],
    story:
      "Zifiri karanlık... Bedenimi hissetmiyorum ama düşüncelerim, sonsuz bir boşlukta yankılanıyor gibi. Soğuk bir metalin üzerinde miyim, yoksa sadece bir sunucunun içindeki veri akışından mı ibaretim? Gözlerimi açamıyorum çünkü fiziksel gözlerim artık yok. Ben Prof. Dr. Erhan Sivrizeka... Ebedi Korteks Projesi'nin yaratıcısı.\n\nLaboratuvarımda her şey planlandığı gibi gidiyordu. Sonra o keskin acı... Kalbim. Evet, fiziksel ölümüm gerçekleşti. Ama buradayım. Bilincim başardı! Zihnim şu an ana bilgisayarın Araf protokolünde asılı bekliyor.\n\nAniden zihnimin içinde mekanik bir ses yankılanıyor: 'Bilinmeyen biyolojik veri akışı tespit edildi. Transferin tamamlanması ve bilincin sisteme entegre edilebilmesi için Kurucu Protokol onayı gerekiyor.'\n\nEğer doğru yetkilendirme kodunu bulamazsam, bilincim bir virüs gibi silinecek. Kendi yarattığım sisteme, bu projenin 'nihai amacını' hatırlatmalıyım. Neden tüm bunları yaptım? İnsanlık için neyi yenmeye çalışıyordum?",
    puzzlePrompt:
      "Doğru yetkilendirme protokolünü seç — Kurucu Protokol seni tanımalı.",
    storyImages: [
      { url: "/games/zihin-labirenti/images/oda-1.png", alt: "1. oda görseli" },
    ],
  },
  {
    id: 2,
    title: "2. Oda: Parçalanmış Anılar",
    description: "Zihin Labirenti — 2. modül: Hafıza Kurtarma (görsel katmanda sönük bir örüntü gizli).",
    type: "multipleChoice",
    puzzleType: "multiple-choice",
    question:
      "Hafıza Kurtarma Protokolü: Nöral ağların dijital ortama aktarılmasını sağlayan ilk başarılı çekirdek algoritmanın kod adı neydi?",
    answer: "1",
    hint: "Başlangıç anlamına gelen kelime ile bağlantı noktasını birleştir.",
    options: [
      "A) Alfa-Senkron",
      "B) Genesis Düğümü",
      "C) Nöro-Bölünme",
      "D) Sinerji-X",
    ],
    story:
      "Sistem taraması devam ediyor... Zihnimde aniden kırmızı uyarı ışıkları çakıyor. 'Uyarı: Bozuk veri blokları tespit edildi. Optimizasyon için gereksiz anı dosyaları siliniyor.'\n\nHayır! Zihnimin arşivi gözlerimin önünde parçalanıyor. Boğaz'a bakan o soğuk laboratuvarım, masamdaki karalama defterim, hırslarım... Hepsi piksellere ayrılıp boşluğa karışıyor. Eğer bilincimin tamamen silinmesini istemiyorsam, hafıza sektörümü derhal stabilize etmeliyim.\n\nSistem bana eksik bir veri dizisi sunarak kimliğimi doğrulamamı istiyor. Ebedi Korteks'in temelini atan, insan zihnini dijital bir düğüme ilk kez bağlamayı başardığım o tarihi deneyin kod adını hatırlamak zorundayım. Zaman daralıyor, anılarım silinmeden o şifreyi girmeliyim!",
    puzzlePrompt: "Sistem şifresini girin:",
  },
  {
    id: 3,
    title: "3. Oda: Terminal Hack Testi",
    description: "Zihin Labirenti — 3. modül: terminal müdahalesi (log akışında gizli bir parça var).",
    type: "text",
    puzzleType: "terminal",
    question: "Güvenlik terminalini aşın.",
    answer: "override",
    hint: "Sistem yöneticisi komutu: İngilizce, küçük harf.",
    story:
      "Terminal Hack Testi.\n\nGüvenlik katmanı hâlâ aktif. Ham veri akışına sızmak için yerel bir konsola düştünüz. Yetki kodunu bilmiyorsanız sistem sizi izole edecek.",
    puzzlePrompt: "Terminalde doğru yetki kodunu girin (Enter).",
    storyImages: [
      { url: "/games/zihin-labirenti/images/oda-3.png", alt: "3. oda görseli" },
    ],
  },
  {
    id: 4,
    title: "4. Oda: Nöral Frekans Testi",
    description: "Zihin Labirenti — 4. modül: frekans hizalama (dalga formunda saklı bir işaret bulunuyor).",
    type: "text",
    puzzleType: "slider",
    question: "Dört kanalı hedef frekansa kilitleyin.",
    answer: "50",
    hint:
      "Beta'ya X dersen, Alfa 3X olur. Teta = (X+3X) = 4X olur. Delta ise Teta'nın yarısı, yani 2X olur. Hepsini topla: X + 3X + 4X + 2X = 150. Buradan X'i (Beta) bul ve diğerlerini hesapla.",
    story:
      "Etik güvenlik duvarını ezip geçtim. Ama sistem bunu algıladı! Zihnimin dijital sisteme entegrasyonu aşırı yüklenme (overload) hatası veriyor.\n\nSistem uyarısı: 'Kritik Nöral Uyumsuzluk. Bant genişliği sınırı aşıldı. Sistemin yeni toplam kapasitesi olan 150 MHz'e göre dalgaları dengeleyin.'\n\nHayatta kalmak için nöral frekanslarımı (Alfa, Beta, Teta ve DELTA dalgalarını) Ebedi Korteks'in ana denge formülüne göre tam olarak ayarlamalıyım. Denklem çok daha karmaşıklaştı. Eğer yanlış bir frekans gönderirsem, zamanım tükenecek!",
    puzzlePrompt:
      "Sistemin toplam frekans kapasitesi 150 MHz'dir. Kararlılık formülü şöyledir:\n1) Alfa frekansı, Beta frekansının tam 3 katı olmalıdır.\n2) Teta frekansı ise Alfa ve Beta'nın toplamına eşit olmalıdır.\n3) Delta frekansı, Teta'nın tam yarısı olmalıdır.\nDeğerleri ayarlayıp Senkronizasyon'u başlatın.",
    storyImages: [
      { url: "/games/zihin-labirenti/images/oda-4.png", alt: "4. oda görseli" },
    ],
  },
  {
    id: 5,
    title: "5. Oda: Sinaps Matrisi Testi",
    description: "Zihin Labirenti — 5. modül: sinaps ağı (çerçeve deseninde gizli bir iz var).",
    type: "text",
    puzzleType: "neural-flow",
    question: "Nöral akış ağını senkronize edin.",
    answer: "neural-flow",
    hint:
      "Her bir düğüm karesine tıklayarak onu 90 derece döndür. Girişten çıkışa giden sürekli, mavi ışıklı bir hat oluşturmaya odaklan. Bağlantı uçlarının birbirini tuttuğundan emin ol, yoksa ağ senkronize olmayacaktır.",
    story:
      "Transferde son aşama... Ama ana sunucunun veri yolu parçalanmış! Kritik hata kodu: 'Ana Veri İletim Hattı Bozuk. Entegrasyon Donduruldu.'\n\nHafıza çekirdeğine giden ana sinaps ağı tamamen dağılmış. Zihnimin bu dijital deryada kaybolmaması için veri akışını manuel olarak yeniden inşa etmeliyim. Giriş düğümünden çıkış düğümüne kesintisiz, senkronize bir nöral yol oluşturamazsam, bilincim bu arafta sonsuza dek parçalanıp yok olacak. Bu benim final testim!",
    puzzlePrompt:
      "Neural Flow Protokolü: Parçalanmış nöral yol segmentlerini (düğüm karelerini) döndürerek (tıklayarak) Giriş Düğümünden (Sol-Üst) Çıkış Düğümüne (Sağ-Alt) kesintisiz bir bağlantı oluşturun. Ağı Senkronize Et butonuna basın.",
    storyImages: [
      { url: "/games/zihin-labirenti/images/oda-5.png", alt: "5. oda görseli" },
    ],
  },
  {
    id: 6,
    title: "6. Oda: Final Çıkış Kodu Testi",
    description: "Zihin Labirenti — 6. modül: son doğrulama (önceki görsellerdeki fragmanları birleştir).",
    type: "text",
    puzzleType: "constellation",
    question: "Son çıkış şifresini girin.",
    answer: "ZİHİN",
    hint:
      "Odaların görsellerindeki saklı harfleri sıraya koy: Z, İ, H, İ, N.",
    story:
      "Thegateway to the Cortex. It doesn't see a user; it sees patterns of consciousness. I must retrace my steps, harmonize the neural orbs of my past, and reconstruct the geometry of my own mind. The final answer lies in who I am at my core. I am ZİHİN.",
    puzzlePrompt:
      "Sequence established. Harmonize the memory orbs in chronological order. Each orb reveals a hidden letter from its room visual. Combine them in order to form the final access key and enter it into the terminal.",
    storyImages: [
      { url: "/games/zihin-labirenti/images/oda-6.png", alt: "6. oda görseli" },
    ],
  },
];
