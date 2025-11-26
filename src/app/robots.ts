import { MetadataRoute } from "next";
import { SEO_ENABLED, STORE_DOMAIN } from "./utils/constants";

export default function robots(): MetadataRoute.Robots {
  // If SEO is disabled, disallow all crawling
  if (!SEO_ENABLED) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    };
  }

  // Normal SEO configuration when enabled
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/cart",
          "/payment/*",
          "/api/*",
          "/_next/*",
          "/static/*",
          "/(auth)/*", // Block admin/auth routes
        ],
      },
    ],
    sitemap: `${STORE_DOMAIN}/sitemap.xml`,
  };
}
