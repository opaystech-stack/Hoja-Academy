import "../lib/patch";
import "./globals.css";
import type { ReactNode } from "react";
import { SITE_ORIGIN } from "../lib/site";

export const metadata = {
  "metadataBase": new URL(SITE_ORIGIN || "http://localhost:3000"),
  "title": "HOJA ACADEMY — La branche académique IA de Hoja Network | Learn AI",
  "description": "Hoja Academy est la branche académique de Hoja Network dédiée à l'intelligence artificielle : former les professionnels, entreprises, institutions et chercheurs à utiliser l'IA pour travailler, automatiser, rechercher et créer.",
  "robots": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  "alternates": {
    "canonical": "/"
  },
  "openGraph": {
    "title": "HOJA ACADEMY | Branche académique IA de Hoja Network",
    "description": "Expert IA, Automatisation & n8n, Robotique, IA & Recherche — des formations pratiques pour résoudre de vrais problèmes professionnels et scientifiques.",
    "type": "website",
    "siteName": "HOJA ACADEMY",
    "url": "/",
    "images": [
      "/assets/cloned/images/fa64729e9a88.png"
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "HOJA ACADEMY | Branche académique IA de Hoja Network",
    "description": "Expert IA, Automatisation & n8n, Robotique, IA & Recherche — des formations pratiques pour résoudre de vrais problèmes professionnels et scientifiques.",
    "images": [
      "/assets/cloned/images/fa64729e9a88.png"
    ]
  },
  "icons": {
    "icon": [
      {
        "url": "/assets/hoja/logo-hoja-cercle.png",
        "sizes": "32x32"
      },
      {
        "url": "/assets/hoja/logo-hoja-cercle.png",
        "sizes": "192x192"
      }
    ],
    "apple": [
      {
        "url": "/assets/hoja/logo-hoja-cercle.png"
      }
    ]
  }
};
export const viewport = {
  "width": "device-width",
  "initialScale": 1
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={"fr"}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <script
          key="ditto-json-ld-0"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: ["{\"@context\":\"https:\\/\\/schema.org\",\"@graph\":[{\"@type\":\"WebPage\",\"@id\":\"", "\\/\",\"url\":\"", "\\/\",\"name\":\"HOJA ACADEMY — Branche académique IA de Hoja Network\",\"isPartOf\":{\"@id\":\"", "\\/#website\"},\"about\":{\"@id\":\"", "\\/#organization\"},\"inLanguage\":\"fr\"},{\"@type\":\"WebSite\",\"@id\":\"", "\\/#website\",\"url\":\"", "\\/\",\"name\":\"HOJA ACADEMY\",\"description\":\"Branche académique de Hoja Network dédiée à l'intelligence artificielle\",\"publisher\":{\"@id\":\"", "\\/#organization\"},\"inLanguage\":\"fr\"},{\"@type\":\"Organization\",\"@id\":\"", "\\/#organization\",\"name\":\"HOJA ACADEMY\",\"url\":\"", "\\/\",\"logo\":{\"@type\":\"ImageObject\",\"inLanguage\":\"fr\",\"@id\":\"", "\\/#\\/schema\\/logo\\/image\\/\",\"url\":\"", "\\/assets\\/cloned\\/images\\/fa64729e9a88.png\",\"contentUrl\":\"", "\\/assets\\/cloned\\/images\\/fa64729e9a88.png\",\"width\":1438,\"height\":360,\"caption\":\"HOJA ACADEMY\"}}]}"].join(SITE_ORIGIN) }}
        />
      </head>
      <body className="cn0">
        {children}
      </body>
    </html>
  );
}
