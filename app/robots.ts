import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Keep both the default Turkish routes and localized English routes crawlable.
      allow: ["/", "/en/"],
      disallow: ["/admin/", "/api/", "/design-system/"],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
    host: siteUrl.origin,
  };
}
