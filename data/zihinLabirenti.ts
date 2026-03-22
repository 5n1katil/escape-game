/**
 * Zihin Labirenti: Son Veri — placeholder oda verileri (içerik sonra doldurulacak).
 */
import type { Room } from "./rooms";

function placeholderRoom(id: number): Room {
  return {
    id,
    title: "Test Odası",
    description: "Test Odası",
    type: "multipleChoice",
    question: "Test Odası",
    answer: "0",
    hint: "Test Odası",
    options: ["Test Odası"],
    story: "Test Odası",
    puzzlePrompt: "Test Odası",
  };
}

export const zihinLabirentiRooms: Room[] = [
  {
    id: 1,
    title: "1. Oda: Sisteme Giriş (Nöro-Boot)",
    description: "Zihin Labirenti — 1. modül: Kurucu Protokol",
    type: "multipleChoice",
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
  },
  placeholderRoom(2),
  placeholderRoom(3),
  placeholderRoom(4),
  placeholderRoom(5),
  placeholderRoom(6),
];
