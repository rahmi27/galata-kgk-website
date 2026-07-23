import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "İstanbul Galata Üniversitesi Kariyer ve Girişimcilik Kulübü",
    short_name: "Galata KGK",
    description:
      "İstanbul Galata Üniversitesi Kariyer ve Girişimcilik Kulübü resmi web sitesi.",
    start_url: "/",
    display: "standalone",
    background_color: "#08090d",
    theme_color: "#1b2a5e",
    lang: "tr",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
