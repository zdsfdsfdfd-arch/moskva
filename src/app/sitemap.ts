import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/brand";

// Содержимое не зависит от запроса; обязательно для статического экспорта.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/consent`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
