/**
 * Zihin Labirenti: Son Veri — oda verileri ve mini-oyun puzzleType alanları.
 */
import type { Room } from "./rooms";

export const zihinLabirentiRooms: Room[] = [
  {
    id: 1,
    title: "1. Oda: Sisteme Giriş (Nöro-Boot)",
    description: "Zihin Labirenti — 1. modül: Kurucu Protokol",
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
    description: "Zihin Labirenti — 2. modül: Hafıza Kurtarma",
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
    description: "Zihin Labirenti — 3. modül: terminal müdahalesi",
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
    description: "Zihin Labirenti — 4. modül: frekans hizalama",
    type: "text",
    puzzleType: "slider",
    question: "Üç kanalı hedef frekansa kilitleyin.",
    answer: "50",
    hint: "Alfa, Beta ve Teta eşitlenmeli.",
    story:
      "Nöral Frekans Testi.\n\nÇekirdek senkronizasyon bozuldu. Üç taşıyıcı hattı aynı genlikte olmadan ilerleyemezsiniz.",
    puzzlePrompt: "Alfa, Beta ve Teta kaydırıcılarını %50 değerine getirin.",
    storyImages: [
      { url: "/games/zihin-labirenti/images/oda-4.png", alt: "4. oda görseli" },
    ],
  },
  {
    id: 5,
    title: "5. Oda: Sinaps Matrisi Testi",
    description: "Zihin Labirenti — 5. modül: sinaps ağı",
    type: "text",
    puzzleType: "matrix",
    question: "Matrisdeki sönük düğümleri aydınlatın.",
    answer: "matrix",
    hint: "Yalnızca kapalı hücrelere dokunun.",
    story:
      "Sinaps Matrisi Testi.\n\nAğda rastgele düşük sinyalli düğümler var. Hepsi aktif olunca geçit açılır.",
    puzzlePrompt: "3×3 ızgarada sönük hücreleri tıklayarak tamamını aktif edin.",
    storyImages: [
      { url: "/games/zihin-labirenti/images/oda-5.png", alt: "5. oda görseli" },
    ],
  },
  {
    id: 6,
    title: "6. Oda: Final Çıkış Kodu Testi",
    description: "Zihin Labirenti — 6. modül: son doğrulama",
    type: "text",
    puzzleType: "text",
    question: "Son çıkış şifresini girin.",
    answer: "ebedi",
    hint: "Projenin özü tek kelimede.",
    story:
      "Final Çıkış Kodu Testi. Şifre: ebedi\n\nTüm modüller tamam. Ana çıkış protokolü yalnızca doğru anahtar kelimeyi kabul eder.",
    puzzlePrompt: "Çıkış şifresini yazıp gönderin.",
    storyImages: [
      { url: "/games/zihin-labirenti/images/oda-6.png", alt: "6. oda görseli" },
    ],
  },
];
