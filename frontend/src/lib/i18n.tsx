"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "tr" | "en";

export interface Strings {
  meta: { title: string };
  nav: { toggleTo: string };
  hero: {
    names: string;
    invite: string;
    dateLine: string;
    venueLine: string;
  };
  countdown: {
    heading: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  story: {
    heading: string;
    paragraph: string;
    photoCaptionA: string;
    photoCaptionB: string;
    placeholderNote: string;
  };
  schedule: {
    heading: string;
    items: { time: string; title: string; description: string }[];
  };
  venue: {
    heading: string;
    name: string;
    address: string;
    mapCta: string;
  };
  info: {
    heading: string;
    dressCode: { title: string; body: string };
    giftList: { title: string; body: string };
    accommodation: { title: string; body: string };
  };
  rsvp: {
    heading: string;
    intro: string;
    /** "{date}" is replaced with the couple's RSVP deadline. */
    deadline: string;
    nameLabel: string;
    attendingLabel: string;
    attendingYes: string;
    attendingNo: string;
    attendingMaybe: string;
    previewNote: string;
    guestsLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    submitError: string;
    disabledNote: string;
  };
  footer: { closing: string; signature: string };
  landing: {
    tagline: string;
    nav: {
      templates: string;
      login: string;
      logout: string;
      myInvitations: string;
      greetingPrefix: string;
      cta: string;
    };
    hero: {
      eyebrow: string;
      headline: string;
      body: string;
      ctaPrimary: string;
      ctaSecondary: string;
      mockupInvite: string;
      mockupNames: string;
      mockupDate: string;
      mockupVenue: string;
    };
    howItWorks: {
      eyebrow: string;
      heading: string;
      steps: { numeral: string; title: string; body: string }[];
    };
    valueProps: {
      eyebrow: string;
      items: { index: string; title: string; body: string }[];
    };
    templateTeaser: {
      eyebrow: string;
      heading: string;
      body: string;
      linkAll: string;
      liveName: string;
      liveLabel: string;
      livePreview: string;
      soonLabel: string;
    };
    cta: {
      heading: string;
      body: string;
      button: string;
    };
    footer: {
      templates: string;
      login: string;
      register: string;
    };
    gallery: {
      back: string;
      eyebrow: string;
      heading: string;
      body: string;
    };
  };
}

export const strings: Record<Lang, Strings> = {
  tr: {
    meta: { title: "Elif & Kerem — Davetiye" },
    nav: { toggleTo: "EN" },
    hero: {
      names: "Elif & Kerem",
      invite: "sizi düğünlerine davet ediyor",
      dateLine: "14 Haziran 2026 · Cumartesi",
      venueLine: "Boğaziçi Yalısı, İstanbul",
    },
    countdown: {
      heading: "Geriye kalan süre",
      days: "gün",
      hours: "saat",
      minutes: "dakika",
      seconds: "saniye",
    },
    story: {
      heading: "Hikayemiz",
      paragraph:
        "Yedi yıl önce bir arkadaş toplantısında tanıştık; o günden bugüne büyüyen bir hikaye, artık sizlerle birlikte kutlamak istediğimiz bir güne dönüştü.",
      photoCaptionA: "Söz günü, 2023",
      photoCaptionB: "Nişan, 2024",
      placeholderNote: "Fotoğraf alanı — gerçek kareler eklenecek",
    },
    schedule: {
      heading: "Günün Programı",
      items: [
        {
          time: "16:00",
          title: "Nikâh Töreni",
          description: "Yalı bahçesinde kısa ve samimi bir tören.",
        },
        {
          time: "17:30",
          title: "Kokteyl",
          description: "Deniz manzaralı terasta içecekler ve canlı müzik.",
        },
        {
          time: "19:00",
          title: "Akşam Yemeği & Dans",
          description: "Ana salonda yemek, ardından gece yarısına dek dans.",
        },
      ],
    },
    venue: {
      heading: "Mekân",
      name: "Boğaziçi Yalısı",
      address: "Kandilli Mahallesi, Boğaziçi Caddesi No. 12, Üsküdar, İstanbul",
      mapCta: "Haritada Aç",
    },
    info: {
      heading: "Bilmeniz Gerekenler",
      dressCode: {
        title: "Kıyafet Kodu",
        body: "Şık, koyu tonlar tercih edilir. Bahçede yürüyüş olacağından topuk yüksekliğine dikkat edebilirsiniz.",
      },
      giftList: {
        title: "Hediye",
        body: "Varlığınız en büyük hediyemiz. Katkıda bulunmak isteyenler için düğün günü nakit hediye masası bulunacaktır.",
      },
      accommodation: {
        title: "Konaklama",
        body: "Mekâna yakın otellerde misafirlerimiz için konaklama önerisi eklenecek.",
      },
    },
    rsvp: {
      heading: "Katılım Bildirimi",
      intro: "Sizi aramızda görmekten mutluluk duyarız.",
      deadline: "Lütfen {date} tarihine kadar bildiriniz.",
      nameLabel: "Ad Soyad",
      attendingLabel: "Katılım durumu",
      attendingYes: "Seve seve geliyorum",
      attendingNo: "Maalesef katılamayacağım",
      attendingMaybe: "Henüz net değil",
      previewNote: "Önizleme — yanıtlar yayınlanan davetiyede kaydedilir.",
      guestsLabel: "Kişi sayısı (siz dahil)",
      messageLabel: "Çifte bir not bırakın",
      messagePlaceholder: "Dileğinizi buraya yazabilirsiniz…",
      submit: "Gönder",
      submitError: "Sunucuya ulaşılamadı. Lütfen tekrar deneyin.",
      disabledNote:
        "Bu davetiye için katılım bildirimi kapatılmış. Sorularınız için çifte doğrudan ulaşabilirsiniz.",
    },
    footer: {
      closing: "Sevgiyle bekliyoruz.",
      signature: "E. & K.",
    },
    landing: {
      tagline: "davetiye stüdyosu",
      nav: {
        templates: "Şablonlar",
        login: "Giriş Yap",
        logout: "Çıkış Yap",
        myInvitations: "Davetiyelerim",
        greetingPrefix: "Merhaba",
        cta: "Davetiye Oluştur",
      },
      hero: {
        eyebrow: "Dijital Düğün Davetiyesi",
        headline: "Davetiyeniz, el işi kadar özenli.",
        body: "Şablon seçin, bilgilerinizi girin — dakikalar içinde paylaşılabilir bir davetiye sayfanız hazır olsun. Misafirleriniz linkten görüntüler, dilerseniz katılım bildirir.",
        ctaPrimary: "Davetiye Oluşturmaya Başla",
        ctaSecondary: "Şablonları İncele",
        mockupInvite: "sizi düğünlerine davet ediyor",
        mockupNames: "Elif & Kerem",
        mockupDate: "14 Haziran 2026 · Cumartesi",
        mockupVenue: "Boğaziçi Yalısı, İstanbul",
      },
      howItWorks: {
        eyebrow: "Nasıl Çalışır",
        heading: "Dört adımda, davetiyeniz elinizde.",
        steps: [
          { numeral: "I", title: "Şablon Seçin", body: "Zevkinize uygun tasarımı galeriden seçin." },
          { numeral: "II", title: "Bilgilerinizi Girin", body: "İsimleriniz, tarih, mekân ve tercihlerinizi tek seferde girin." },
          { numeral: "III", title: "Davetiyeniz Hazırlansın", body: "Girdiğiniz bilgilerle davetiyeniz otomatik oluşturulur." },
          { numeral: "IV", title: "Paylaşın, Takip Edin", body: "Linki misafirlerinizle paylaşın, katılım yanıtlarını panelden izleyin." },
        ],
      },
      valueProps: {
        eyebrow: "Neden Zarify",
        items: [
          { index: "01", title: "Kolay Düzenleme", body: "Kod bilmeden, adım adım bir formla davetiyenizi oluşturun; sonradan fontunu, rengini, fotoğraflarını değiştirin." },
          { index: "02", title: "Katılım Takibi", body: "Misafirlerinizin katılım yanıtlarını tek panelden görün, RSVP'yi dilediğinizde açıp kapatın." },
          { index: "03", title: "Türkçe & İngilizce", body: "Misafirleriniz davetiyeyi ikisinden istediği dilde görüntüleyebilir." },
        ],
      },
      templateTeaser: {
        eyebrow: "Şablon Galerisi",
        heading: "Bir şablonla başlayın.",
        body: "Galeri her ay büyüyor; seçtiğiniz şablonu kendi bilgilerinizle doldurup ince ayar yaparsınız.",
        linkAll: "Tüm şablonları gör →",
        liveName: "Nikâh Daveti",
        liveLabel: "Önizle",
        livePreview: "E & K",
        soonLabel: "Yakında",
      },
      cta: {
        heading: "Davetiyenizi bugün oluşturmaya başlayın.",
        body: "Kayıt ve bilgilerinizi girmek ücretsiz. Şablonunuzu seçtikten sonra paket fiyatlarını görür, dilediğiniz an karar verirsiniz.",
        button: "Ücretsiz Başla",
      },
      footer: {
        templates: "Şablonlar",
        login: "Giriş Yap",
        register: "Kayıt Ol",
      },
      gallery: {
        back: "← Zarify",
        eyebrow: "Şablon Galerisi",
        heading: "Davetiyenize bir başlangıç noktası seçin.",
        body: "Her şablon kendi renk, yazı ve düzen kimliğiyle gelir. Seçtiğiniz şablonu sonradan kendi bilgilerinizle doldurup ince ayar yapabilirsiniz.",
      },
    },
  },
  en: {
    meta: { title: "Elif & Kerem — Wedding Invitation" },
    nav: { toggleTo: "TR" },
    hero: {
      names: "Elif & Kerem",
      invite: "invite you to their wedding",
      dateLine: "June 14, 2026 · Saturday",
      venueLine: "Bosphorus Waterside House, Istanbul",
    },
    countdown: {
      heading: "Time remaining",
      days: "days",
      hours: "hours",
      minutes: "minutes",
      seconds: "seconds",
    },
    story: {
      heading: "Our Story",
      paragraph:
        "We met seven years ago at a friend's gathering. What began that evening has grown into a story we now want to celebrate with all of you.",
      photoCaptionA: "The proposal, 2023",
      photoCaptionB: "Engagement, 2024",
      placeholderNote: "Photo placeholder — real photos coming soon",
    },
    schedule: {
      heading: "Order of the Day",
      items: [
        {
          time: "4:00 PM",
          title: "Ceremony",
          description: "A short, intimate ceremony in the waterside garden.",
        },
        {
          time: "5:30 PM",
          title: "Cocktail Hour",
          description: "Drinks and live music on the sea-view terrace.",
        },
        {
          time: "7:00 PM",
          title: "Dinner & Dancing",
          description: "Dinner in the main hall, dancing until midnight.",
        },
      ],
    },
    venue: {
      heading: "Venue",
      name: "Bosphorus Waterside House",
      address: "Kandilli, Boğaziçi Avenue No. 12, Üsküdar, Istanbul",
      mapCta: "Open in Maps",
    },
    info: {
      heading: "Good to Know",
      dressCode: {
        title: "Dress Code",
        body: "Elegant, dark tones preferred. There is a short garden walk, so heel height is worth considering.",
      },
      giftList: {
        title: "Gifts",
        body: "Your presence is the only gift we need. For those who wish to contribute, a gift table will be available on the day.",
      },
      accommodation: {
        title: "Accommodation",
        body: "A recommended nearby hotel for out-of-town guests will be added here.",
      },
    },
    rsvp: {
      heading: "RSVP",
      intro: "We would be delighted to have you with us.",
      deadline: "Please respond by {date}.",
      nameLabel: "Full name",
      attendingLabel: "Will you attend?",
      attendingYes: "Joyfully attending",
      attendingNo: "Regretfully declining",
      attendingMaybe: "Not sure yet",
      previewNote: "Preview — replies are saved on the published invitation.",
      guestsLabel: "Party size (including you)",
      messageLabel: "Leave a note for the couple",
      messagePlaceholder: "Write your wishes here…",
      submit: "Send",
      submitError: "Couldn't reach the server. Please try again.",
      disabledNote:
        "RSVP has been turned off for this invitation. Please reach out to the couple directly with any questions.",
    },
    footer: {
      closing: "With love, we look forward to seeing you.",
      signature: "E. & K.",
    },
    landing: {
      tagline: "invitation atelier",
      nav: {
        templates: "Templates",
        login: "Log In",
        logout: "Log Out",
        myInvitations: "My Invitations",
        greetingPrefix: "Hello",
        cta: "Create an Invitation",
      },
      hero: {
        eyebrow: "Digital Wedding Invitations",
        headline: "Your invitation, as considered as handwork.",
        body: "Pick a template, fill in your details — have a shareable invitation page ready in minutes. Guests view it from a link, and can RSVP if you enable it.",
        ctaPrimary: "Start Creating Your Invitation",
        ctaSecondary: "Browse Templates",
        mockupInvite: "invite you to their wedding",
        mockupNames: "Elif & Kerem",
        mockupDate: "June 14, 2026 · Saturday",
        mockupVenue: "Bosphorus Waterside House, Istanbul",
      },
      howItWorks: {
        eyebrow: "How It Works",
        heading: "Your invitation, in four steps.",
        steps: [
          { numeral: "I", title: "Choose a Template", body: "Pick the design that fits your taste from the gallery." },
          { numeral: "II", title: "Add Your Details", body: "Names, date, venue, and preferences — all in one pass." },
          { numeral: "III", title: "Your Invitation Is Ready", body: "Your invitation is generated automatically from what you entered." },
          { numeral: "IV", title: "Share and Track", body: "Share the link with guests, and watch RSVPs from your dashboard." },
        ],
      },
      valueProps: {
        eyebrow: "Why Zarify",
        items: [
          { index: "01", title: "Easy to Edit", body: "Build your invitation through a step-by-step form, no code — change its font, color, and photos afterward." },
          { index: "02", title: "RSVP Tracking", body: "See every guest's response from one dashboard, and turn RSVP on or off whenever you like." },
          { index: "03", title: "Turkish & English", body: "Guests can view the invitation in whichever language they prefer." },
        ],
      },
      templateTeaser: {
        eyebrow: "Template Gallery",
        heading: "Start with a template.",
        body: "The gallery grows every month; fill your chosen template with your own details and fine-tune it afterward.",
        linkAll: "See all templates →",
        liveName: "Wedding Invitation",
        liveLabel: "Preview",
        livePreview: "E & K",
        soonLabel: "Coming Soon",
      },
      cta: {
        heading: "Start creating your invitation today.",
        body: "Signing up and entering your details is free. Once you choose a template, you'll see package pricing and can decide whenever you're ready.",
        button: "Start for Free",
      },
      footer: {
        templates: "Templates",
        login: "Log In",
        register: "Sign Up",
      },
      gallery: {
        back: "← Zarify",
        eyebrow: "Template Gallery",
        heading: "Choose a starting point for your invitation.",
        body: "Each template carries its own color, type, and layout identity. Fill your chosen template with your own details and fine-tune it afterward.",
      },
    },
  },
};

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Strings;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  initialLang = "tr",
  children,
}: {
  initialLang?: Lang;
  children: ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  // Keep <html lang> in step with the toggle: CSS `text-transform:
  // uppercase` is language-aware, so with lang="tr" left in place the
  // English labels uppercase "i" to Turkish "İ" ("WİLL YOU ATTEND?"). It
  // also tells screen readers which pronunciation to use. The server
  // renders lang="tr" (see app/layout.tsx), matching initialLang.
  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.documentElement.lang = next;
  }, []);
  const value = useMemo(
    () => ({ lang, setLang, t: strings[lang] }),
    [lang, setLang],
  );
  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}
