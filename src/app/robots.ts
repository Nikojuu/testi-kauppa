import { MetadataRoute } from "next";
import { SEO_ENABLED } from "./utils/constants";

export default function robots(): MetadataRoute.Robots {
  // Get domain from environment variable (fallback to constant if needed)
  const domain =
    process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";

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
    sitemap: `${domain}/sitemap.xml`,
  };
}
