export const defaultLocale = "tr" as const;
export type Locale = "tr" | "en";

export const translations = {
  tr: {
    meta: {
      title: "5N1Dedektif Escape Lab",
      description:
        "Etkileyici dedektif deneyimi sunan escape room platformu. Gizemleri çözün, ipuçlarını takip edin.",
    },
    home: {
      title: "5N1Dedektif Escape Lab",
      subtitle:
        "Gizemleri çözün, ipuçlarını takip edin. Etkileyici dedektif deneyimi sunan escape room platformu.",
      cta: "Escape Odaları",
    },
    escapeRooms: {
      title: "Escape Odaları",
      subtitle: "Maceraya atıl. Bir oyun seç ve tapınağın lanetini kır.",
      play: "Oyna",
      back: "← Geri",
    },
    intro: {
      story: "Hikaye",
      rules: "Kurallar",
      mapPreview: "Harita",
      audio: "Arka plan müziği",
      startGame: "Oyuna Başla",
      continueGame: "Devam Et",
      restartFromIntro: "Baştan Başlat",
      back: "← Geri",
    },
    room: {
      back: "← Geri",
      title: "Tapınağın Laneti",
      story: {
        p1: "Antik tapınak önünüzde yükseliyor; taş duvarları yüzyılların yağmuru ve gölgesiyle aşınmış. Efsane, gizli hazinesini arayanların üzerine konan bir lanetten bahseder—sadece akıllı ve cesur olanlar sağ çıkar.",
        p2: "Ağır kapıları itip açıyorsunuz. Toz loş ışıkta savruluyor. Saatiniz başladı. İpuçlarını bulun, bilmeceleri çözün ve zaman dolmadan laneti kırın.",
      },
      timerAriaLabel: "Kalan süre: {minutes} dakika {seconds} saniye",
      answerPlaceholder: "Cevabınızı yazın...",
      answerLabel: "Cevabınız",
      submitAnswer: "Cevabı Gönder",
      wrongAnswer: "Yanlış cevap. Tekrar deneyin.",
      attempts: "Deneme: {count}",
      map: "Harita",
      room: "Oda",
      locked: "Kilitli",
      current: "Mevcut",
      solved: "Çözüldü",
      restartGame: "Oyunu Yeniden Başlat",
      roomSolved: "Oda çözüldü!",
      goToNextRoom: "Sonraki Odaya Git",
      completeEscape: "Kaçışı Tamamla",
      puzzlePlaceholders: {
        multipleChoice: "Çoktan seçmeli bulmaca alanı",
        imageChoice: "Görsel bulmaca alanı",
        objectFind: "Nesne bulma alanı",
        videoPuzzle: "Video bulmaca alanı",
      },
      escaped: {
        title: "Kaçtınız!",
        message: "Tebrikler! Laneti kırdınız ve tapınağı başarıyla terk ettiniz.",
        playAgain: "Tekrar Oyna",
      },
      result: {
        title: "Kaçış Tamamlandı",
        finalScore: "Puan",
        remainingTime: "Kalan süre",
        totalAttempts: "Toplam deneme",
        firstTryCount: "İlk denemede çözülen oda",
      },
    },
    hub: {
      title: "Ana Ekran",
      backToIntro: "← Geri",
      story: "Hikâye",
      map: "Harita",
      rooms: "Odalar",
      goToRoom: "Odaya Git",
      allRoomsSolved: "Tüm odalar çözüldü. Son şifreyi girin.",
      finalCodeLabel: "Son şifre",
      finalCodePlaceholder: "Şifreyi yazın...",
      finalCodeSubmit: "Kaçışı Tamamla",
      finalCodeWrong: "Yanlış şifre.",
      backToHub: "Ana Ekrana Dön",
    },
    result: {
      endTitle: "Tapınaktan Kaçtınız",
      endStory: "Laneti kırdınız ve tapınağı güvenle terk ettiniz. Tebrikler!",
      backToWix: "Wix Sitesine Dön",
    },
  },
  en: {
    meta: {
      title: "5N1Dedektif Escape Lab",
      description:
        "A detective escape room system built for immersive investigations.",
    },
    home: {
      title: "5N1Dedektif Escape Lab",
      subtitle:
        "Solve mysteries, follow the clues. A detective escape room system built for immersive investigations.",
      cta: "Start Escape Room",
    },
    escapeRooms: {
      title: "Escape Rooms",
      subtitle: "Choose a game and start your adventure.",
      play: "Play",
      back: "← Back",
    },
    intro: {
      story: "Story",
      rules: "Rules",
      mapPreview: "Map",
      audio: "Background music",
      startGame: "Start Game",
      continueGame: "Continue",
      restartFromIntro: "Start Over",
      back: "← Back",
    },
    room: {
      back: "← Back",
      title: "Escape Room – Temple of the Curse",
      story: {
        p1: "The ancient temple looms before you, its stone walls weathered by centuries of rain and shadow. Legend speaks of a curse placed upon those who enter seeking its hidden treasure—only the clever and the bold emerge unscathed.",
        p2: "You push open the heavy doors. Dust swirls in the dim light. Your hour has begun. Find the clues, solve the riddles, and break the curse before time runs out.",
      },
      timerAriaLabel: "Time remaining: {minutes} minutes and {seconds} seconds",
      answerPlaceholder: "Type your answer...",
      answerLabel: "Your answer",
      submitAnswer: "Submit Answer",
      wrongAnswer: "Wrong answer. Try again.",
      attempts: "Attempts: {count}",
      map: "Map",
      room: "Room",
      locked: "Locked",
      current: "Current",
      solved: "Solved",
      restartGame: "Restart Game",
      roomSolved: "Room solved!",
      goToNextRoom: "Go to Next Room",
      completeEscape: "Complete Escape",
      puzzlePlaceholders: {
        multipleChoice: "Multiple choice puzzle area",
        imageChoice: "Image puzzle area",
        objectFind: "Object find area",
        videoPuzzle: "Video puzzle area",
      },
      escaped: {
        title: "You Escaped!",
        message: "Congratulations! You broke the curse and left the temple successfully.",
        playAgain: "Play Again",
      },
      result: {
        title: "Escape Complete",
        finalScore: "Score",
        remainingTime: "Time remaining",
        totalAttempts: "Total attempts",
        firstTryCount: "Rooms solved first try",
      },
    },
    hub: {
      title: "Hub",
      backToIntro: "← Back",
      story: "Story",
      map: "Map",
      rooms: "Rooms",
      goToRoom: "Enter room",
      allRoomsSolved: "All rooms solved. Enter final code.",
      finalCodeLabel: "Final code",
      finalCodePlaceholder: "Enter code...",
      finalCodeSubmit: "Complete escape",
      finalCodeWrong: "Wrong code.",
      backToHub: "Back to hub",
    },
    result: {
      endTitle: "You escaped the temple",
      endStory: "You broke the curse and left the temple safely. Congratulations!",
      backToWix: "Back to Wix site",
    },
  },
} as const;

export type Translations = (typeof translations)[Locale];

export function getTranslations(locale: Locale = defaultLocale): Translations {
  return translations[locale];
}
