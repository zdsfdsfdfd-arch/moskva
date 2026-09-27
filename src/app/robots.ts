import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/brand";

// Содержимое не зависит от запроса; обязательно для статического экспорта.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
