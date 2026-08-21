import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.SITE_URL || "https://www.investory.co.in";

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/studio", "/api"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
