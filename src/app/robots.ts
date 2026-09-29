import type { MetadataRoute } from 'next';

const siteUrl = (process.env.SITE_URL || "http://localhost:3000");
// Configuration robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    // Lien du sitemap XML
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}