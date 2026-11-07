type BotanicalSpec = {
  bloom: string;
  leaf: string;
  accent: string;
  petalCount: number;
  variant: number;
};

const specs: Record<string, BotanicalSpec> = {
  dugun: { bloom: "#E5D8C4", leaf: "#78836A", accent: "#B69A6A", petalCount: 7, variant: 0 },
  nisan: { bloom: "#B78A88", leaf: "#7A826A", accent: "#C3A37B", petalCount: 9, variant: 1 },
  soz: { bloom: "#D8BEA8", leaf: "#818B76", accent: "#A97D69", petalCount: 6, variant: 2 },
  isteme: { bloom: "#D1AD9F", leaf: "#667A68", accent: "#B59473", petalCount: 8, variant: 3 },
  "kina-gecesi": { bloom: "#A56A64", leaf: "#747B5C", accent: "#B88B53", petalCount: 8, variant: 4 },
  sunnet: { bloom: "#D9C8A7", leaf: "#788477", accent: "#9D9876", petalCount: 7, variant: 5 },
  "dogum-gunu": { bloom: "#C8A5A2", leaf: "#818A6D", accent: "#C6A477", petalCount: 6, variant: 6 },
  "baby-shower": { bloom: "#D9C6B9", leaf: "#8B9985", accent: "#B7A18E", petalCount: 5, variant: 7 },
  "cinsiyet-partisi": { bloom: "#C4B8CB", leaf: "#87947E", accent: "#C4A5A1", petalCount: 7, variant: 8 },
  mevlit: { bloom: "#D5C9AD", leaf: "#7D8A78", accent: "#B3A184", petalCount: 8, variant: 9 },
  kurumsal: { bloom: "#D4C5AC", leaf: "#747F6D", accent: "#A89978", petalCount: 5, variant: 10 },
  yildonumu: { bloom: "#BFA09B", leaf: "#77826D", accent: "#B8A17E", petalCount: 9, variant: 11 },
};

/** Muted, filled botanical studies inspired by archival herbarium plates. */
export function BotanicalCategoryArt({ category }: { category: string }) {
  const spec = specs[category] ?? specs.dugun;
  const turn = spec.variant * 13;
  const flowers = [
    { x: 90, y: 51, scale: 1, angle: turn },
    { x: 127, y: 87, scale: 0.67, angle: turn + 23 },
    { x: 65, y: 111, scale: 0.48, angle: turn - 19 },
  ];

  return (
    <svg viewBox="0 0 180 165" fill="none" aria-hidden="true" className="h-full w-full overflow-visible">
      <g opacity=".85" stroke="#817C65" strokeWidth="1.05" strokeLinecap="round">
        <path d="M83 164C92 129 94 96 90 52" />
        <path d="M88 139C104 115 113 103 127 87" />
        <path d="M89 132C79 120 72 117 65 111" />
        <path d="M91 104C72 90 57 78 41 69" />
        <path d="M95 119C116 115 137 121 151 133" />
      </g>
      <g fill={spec.leaf} fillOpacity=".77" stroke="#6E7966" strokeWidth=".65">
        <path d="M82 127C60 129 48 115 45 97c20 1 32 12 37 30Z" />
        <path d="M100 118c1-23 13-36 32-40-1 22-12 35-32 40Z" />
        <path d="M74 94C52 95 39 84 33 67c19-2 33 8 41 27Z" />
        <path d="M111 106c13-14 28-18 44-12-10 16-25 20-44 12Z" />
        <path d="M87 149c-19-2-30-12-33-25 16 1 28 9 33 25Z" />
        <path d="M106 136c14-13 29-15 43-9-11 13-25 17-43 9Z" />
      </g>
      {flowers.map((flower, flowerIndex) => (
        <g key={flowerIndex} transform={`translate(${flower.x} ${flower.y}) rotate(${flower.angle}) scale(${flower.scale})`}>
          {Array.from({ length: spec.petalCount }, (_, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-16"
              rx={flowerIndex === 1 ? "7.5" : "8.5"}
              ry={flowerIndex === 1 ? "16" : "19"}
              transform={`rotate(${(360 / spec.petalCount) * i})`}
              fill={spec.bloom}
              fillOpacity=".88"
              stroke="#8E7A70"
              strokeOpacity=".45"
              strokeWidth=".65"
            />
          ))}
          <circle r="7.2" fill={spec.accent} fillOpacity=".88" stroke="#87755C" strokeWidth=".6" />
          {Array.from({ length: 7 }, (_, i) => (
            <circle key={i} cx={Math.cos(i * 6.28 / 7) * 3.5} cy={Math.sin(i * 6.28 / 7) * 3.5} r=".9" fill="#F7EBD7" />
          ))}
        </g>
      ))}
      <g fill={spec.accent} fillOpacity=".72">
        <circle cx="42" cy="69" r="2.3" />
        <circle cx="36" cy="64" r="1.7" />
        <circle cx="151" cy="133" r="2.2" />
        <circle cx="157" cy="130" r="1.6" />
      </g>
    </svg>
  );
}
