import type { MetadataRoute } from "next";

/** For "Add to Home Screen": the wine Z monogram on ivory (icons generated
 * from Gloock — see ASSETS.md), ivory/ink theme colours from DESIGN.md. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zarify — Dijital Düğün Davetiyesi",
    short_name: "Zarify",
    description: "Şablon seçin, bilgilerinizi girin; düğün davetiyesi sayfanız dakikalar içinde hazır olsun.",
    start_url: "/",
    display: "standalone",
    background_color: "#efe8d6",
    theme_color: "#120f0c",
    lang: "tr",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
