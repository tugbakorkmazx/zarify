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
  nav: { toggleTo: string };
  hero: {
    names: string;
    invite: string;
    dateLine: string;
    venueLine: string;
    /** Folio strip label at the top of the cover. */
    folio: string;
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
    /** Shown above the form when this browser already replied: "{name}"
     * is the name it replied under. */
    returningNote: string;
    guestsLabel: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    submitError: string;
    disabledNote: string;
    /** The deadline (or the wedding day) has passed. */
    closedNote: string;
    /** Shown under the form — the point where guest data is collected, so
     * KVKK wants the notice (and a link to the full text) right here. */
    privacyNote: string;
    privacyLink: string;
    kvkkLink: string;
  };
  footer: { closing: string; signature: string };
  envelope: {
    hint: string;
    /** aria-label while closed / while opening. */
    openLabel: string;
    viewLabel: string;
  };
  landing: {
    tagline: string;
    nav: {
      templates: string;
      login: string;
      logout: string;
      myInvitations: string;
      admin: string;
      cta: string;
    };
    hero: {
      eyebrow: string;
      headline: string;
      body: string;
      ctaPrimary: string;
      ctaSecondary: string;
      mockupNames: string;
    };
    howItWorks: {
      eyebrow: string;
      heading: string;
        motto: string;
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
      liveLabel: string;
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
      legalHeading: string;
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
    nav: { toggleTo: "EN" },
    hero: {
      names: "Elif & Kerem",
      invite: "sizi düğünlerine davet ediyor",
      dateLine: "12 Haziran 2027 · Cumartesi",
      venueLine: "Boğaziçi Yalısı, İstanbul",
      folio: "Düğün Davetiyesi",
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
      returningNote:
        "Bu tarayıcıdan “{name}” adıyla yanıt verdiniz. Formu yeniden gönderirseniz önceki yanıtınız güncellenir.",
      guestsLabel: "Kişi sayısı (siz dahil)",
      messageLabel: "Çifte bir not bırakın",
      messagePlaceholder: "Dileğinizi buraya yazabilirsiniz…",
      submit: "Gönder",
      submitError: "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.",
      disabledNote:
        "Bu davetiye için katılım bildirimi kapatılmış. Sorularınız için çifte doğrudan ulaşabilirsiniz.",
      closedNote: "Katılım bildirimi süresi doldu. Sorularınız için çifte doğrudan ulaşabilirsiniz.",
      privacyNote:
        "Adınız, katılım durumunuz ve notunuz yalnızca davetiye sahibiyle paylaşılır.",
      privacyLink: "Gizlilik Politikası",
      kvkkLink: "KVKK Aydınlatma Metni",
    },
    footer: {
      closing: "Sevgiyle bekliyoruz.",
      signature: "E. & K.",
    },
    envelope: {
      hint: "Açmak için dokunun",
      openLabel: "Davetiyeyi açmak için dokunun",
      viewLabel: "Davetiyeyi görüntüle",
    },
    landing: {
      tagline: "davetiye stüdyosu",
      nav: {
        templates: "Şablonlar",
        login: "Giriş Yap",
        logout: "Çıkış Yap",
        myInvitations: "Davetiyelerim",
        admin: "Yönetim",
        cta: "Davetiye Oluştur",
      },
      hero: {
        eyebrow: "Dijital Düğün Davetiyesi",
        headline: "Davetiyeniz, el işi kadar özenli.",
        body: "Şablon seçin, bilgilerinizi girin — davetiye sayfanız dakikalar içinde hazır olsun. Yayına aldığınızda misafirleriniz linkten görüntüler, dilerseniz katılım bildirir.",
        ctaPrimary: "Davetiye Oluşturmaya Başla",
        ctaSecondary: "Şablonları İncele",
        mockupNames: "Elif & Kerem",
      },
      howItWorks: {
        eyebrow: "Nasıl Çalışır",
        heading: "Dört adımda, davetiyeniz elinizde.",
        motto: "Sevginizi çerçeveleyin.",
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
          { index: "01", title: "Kolay Düzenleme", body: "Kod bilmeden, adım adım bir formla davetiyenizi oluşturun; yayınladıktan sonra da bilgilerinizi dilediğiniz zaman güncelleyin." },
          { index: "02", title: "Katılım Takibi", body: "Misafirlerinizin katılım yanıtlarını tek panelden görün, RSVP'yi dilediğinizde açıp kapatın." },
          { index: "03", title: "Türkçe & İngilizce", body: "Davetiyenin başlıkları, geri sayımı ve katılım formu iki dilde hazır; misafirleriniz dili tek dokunuşla değiştirir." },
        ],
      },
      templateTeaser: {
        eyebrow: "Şablon Galerisi",
        heading: "Bir şablonla başlayın.",
        body: "Herbaryum şablonunu kendi bilgilerinizle doldurun, önizleyin; hazır olduğunuzda yayınlayın.",
        linkAll: "Şablon galerisi →",
        liveLabel: "Önizle",
      },
      cta: {
        heading: "Davetiyenizi bugün oluşturmaya başlayın.",
        body: "Kayıt olmak, bilgilerinizi girmek ve davetiyenizi önizlemek ücretsiz. Ücret yalnızca davetiyenizi yayına alırken ödenir.",
        button: "Ücretsiz Başla",
      },
      footer: {
        templates: "Şablonlar",
        login: "Giriş Yap",
        register: "Kayıt Ol",
        legalHeading: "Hukuki metinler",
      },
      gallery: {
        back: "← Zarify",
        eyebrow: "Şablon Galerisi",
        heading: "Davetiyenize bir başlangıç noktası seçin.",
        body: "Şablonu kendi bilgilerinizle doldurun, nasıl göründüğünü önizleyin; hazır olduğunuzda yayınlayın.",
      },
    },
  },
  en: {
    nav: { toggleTo: "TR" },
    hero: {
      names: "Elif & Kerem",
      invite: "invite you to their wedding",
      dateLine: "June 12, 2027 · Saturday",
      venueLine: "Bosphorus Waterside House, Istanbul",
      folio: "Wedding Invitation",
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
      returningNote:
        "You already replied from this browser as “{name}”. Sending the form again updates that reply.",
      guestsLabel: "Party size (including you)",
      messageLabel: "Leave a note for the couple",
      messagePlaceholder: "Write your wishes here…",
      submit: "Send",
      submitError: "Couldn't reach the server. Check your connection and try again.",
      disabledNote:
        "RSVP has been turned off for this invitation. Please reach out to the couple directly with any questions.",
      closedNote: "The RSVP deadline has passed. For any questions, please contact the couple directly.",
      privacyNote:
        "Your name, reply, and note are shared only with the invitation's owner.",
      privacyLink: "Privacy Policy",
      kvkkLink: "Personal Data Notice",
    },
    footer: {
      closing: "With love, we look forward to seeing you.",
      signature: "E. & K.",
    },
    envelope: {
      hint: "Tap to open",
      openLabel: "Tap to open the invitation",
      viewLabel: "View the invitation",
    },
    landing: {
      tagline: "invitation atelier",
      nav: {
        templates: "Templates",
        login: "Log In",
        logout: "Log Out",
        myInvitations: "My Invitations",
        admin: "Admin",
        cta: "Create an Invitation",
      },
      hero: {
        eyebrow: "Digital Wedding Invitations",
        headline: "Your invitation, as considered as handwork.",
        body: "Pick a template, fill in your details — have your invitation page ready in minutes. Once it's published, guests view it from a link, and can RSVP if you enable it.",
        ctaPrimary: "Start Creating Your Invitation",
        ctaSecondary: "Browse Templates",
        mockupNames: "Elif & Kerem",
      },
      howItWorks: {
        eyebrow: "How It Works",
        heading: "Your invitation, in four steps.",
        motto: "Frame your love story.",
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
          { index: "01", title: "Easy to Edit", body: "Build your invitation through a step-by-step form, no code — and update your details whenever you like, even after it's published." },
          { index: "02", title: "RSVP Tracking", body: "See every guest's response from one dashboard, and turn RSVP on or off whenever you like." },
          { index: "03", title: "Turkish & English", body: "The invitation's headings, countdown and RSVP form come in both languages; guests switch with one tap." },
        ],
      },
      templateTeaser: {
        eyebrow: "Template Gallery",
        heading: "Start with a template.",
        body: "Fill the Herbaryum template with your own details, preview it, and publish when you're ready.",
        linkAll: "Template gallery →",
        liveLabel: "Preview",
      },
      cta: {
        heading: "Start creating your invitation today.",
        body: "Signing up, entering your details and previewing your invitation are free. You only pay when you publish it.",
        button: "Start for Free",
      },
      footer: {
        templates: "Templates",
        login: "Log In",
        register: "Sign Up",
        legalHeading: "Legal",
      },
      gallery: {
        back: "← Zarify",
        eyebrow: "Template Gallery",
        heading: "Choose a starting point for your invitation.",
        body: "Fill the template with your own details, preview how it looks, and publish when you're ready.",
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
