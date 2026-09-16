import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "../lib/site";

export const dynamic = "force-static";

const PAGES = [
  "/", "/formations", "/formations/expert-ia", "/formations/automatisation-n8n",
  "/formations/robotique", "/formations/ia-recherche-sciences",
  "/entreprises", "/contact", "/postuler", "/formations/programme-intensif",
  "/mentions-legales", "/confidentialite", "/cookies", "/accessibilite",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((url, i) => ({
    url: SITE_ORIGIN + url,
    changeFrequency: "weekly",
    priority: i === 0 ? 1 : 0.7,
  }));
}
