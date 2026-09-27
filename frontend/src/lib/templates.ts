export interface TemplateSummary {
  slug: string;
  name: string;
  description: string;
}

export const templates: TemplateSummary[] = [
  {
    slug: "nikah-tezhibi",
    name: "Herbaryum",
    description:
      "Klasik yağlı boya tabloların üzerinde dantel kart ve yaldızlı çerçeveler: kuğulu göl, bordo ve zeytin bantlar, gün batımında bir kapanış.",
  },
];

export function getTemplate(slug: string) {
  return templates.find((tpl) => tpl.slug === slug);
}
