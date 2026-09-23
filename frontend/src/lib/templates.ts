export interface TemplateSummary {
  slug: string;
  name: string;
  description: string;
  status: "live" | "soon";
  /** [ground, accent, ink] — used for the small swatch on the template card. */
  palette: [string, string, string];
}

export const templates: TemplateSummary[] = [
  {
    slug: "nikah-tezhibi",
    name: "Nikâh Tezhibi",
    description:
      "Osmanlı tezhip sanatından ilhamla: fildişi zemin üzerine ince altın çizgiler, ağırbaşlı bir tören havası.",
    status: "live",
    palette: ["#f6efdd", "#a97a2f", "#3a1420"],
  },
  {
    slug: "yakinda-bahar",
    name: "Yakında",
    description: "Galeriye her ay yeni bir tasarım ekliyoruz.",
    status: "soon",
    palette: ["#ecdfba", "#7c5720", "#6b3242"],
  },
  {
    slug: "yakinda-lacivert",
    name: "Yakında",
    description: "Bir sonraki şablon üzerinde çalışıyoruz.",
    status: "soon",
    palette: ["#d9c894", "#a97a2f", "#3a1420"],
  },
];

export function getTemplate(slug: string) {
  return templates.find((tpl) => tpl.slug === slug);
}
