export interface EventCategory {
  slug: string;
  name: string;
}

export const eventCategories: EventCategory[] = [
  { slug: "dugun", name: "Düğün" },
  { slug: "nisan", name: "Nişan" },
  { slug: "soz", name: "Söz" },
  { slug: "isteme", name: "İsteme" },
  { slug: "kina-gecesi", name: "Kına gecesi" },
  { slug: "sunnet", name: "Sünnet" },
  { slug: "dogum-gunu", name: "Doğum günü" },
  { slug: "baby-shower", name: "Baby shower" },
  { slug: "cinsiyet-partisi", name: "Cinsiyet partisi" },
  { slug: "mevlit", name: "Mevlit" },
  { slug: "kurumsal", name: "Açılış / kurumsal davet" },
  { slug: "yildonumu", name: "Yıldönümü" },
];

export interface TemplateSummary {
  slug: string;
  name: string;
  description: string;
  categorySlug: string;
}

export const templates: TemplateSummary[] = [
  {
    slug: "hikaye-kitabi",
    name: "Hikâye Kitabı",
    description: "Altın işlemeli bir kapağın ardında açılan, sayfa sayfa kişiselleştirebileceğiniz romantik bir düğün davetiyesi.",
    categorySlug: "dugun",
  },
  {
    slug: "nikah-tezhibi",
    name: "Herbaryum",
    description:
      "Klasik yağlı boya tabloların üzerinde dantel kart ve yaldızlı çerçeveler: kuğulu göl, bordo ve zeytin bantlar, gün batımında bir kapanış.",
    categorySlug: "dugun",
  },
];

export function getTemplate(slug: string) {
  return templates.find((tpl) => tpl.slug === slug);
}

export function getEventCategory(slug: string) {
  return eventCategories.find((category) => category.slug === slug);
}
