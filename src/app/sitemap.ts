import { MetadataRoute } from "next";
import { Category, Product } from "./utils/types";
import { getStoreConfig, getSEOValue, SEO_FALLBACKS } from "@/lib/actions/storeConfigActions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get domain from store config with fallback
  let domain = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
  try {
    const config = await getStoreConfig();
    domain = getSEOValue(config.seo.domain, domain);
  } catch (error) {
    console.error("Error fetching store config for sitemap:", error);
  }

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/filtered-products?slugs=all-products&page=1&pageSize=1000`,
        {
          headers: {
            "x-api-key": process.env.STOREFRONT_API_KEY || "",
          },
          next: {
            revalidate: 13600, // Revalidate every hour
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/categories`,
        {
          headers: {
            "x-api-key": process.env.STOREFRONT_API_KEY || "",
          },
          next: {
            revalidate: 13600,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  const [products, categories] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
  ]);

  const productUrls = products.map((product: Product) => ({
    url: `${domain}/product/${product.slug}`,
    lastModified: product.createdAt,
  }));

  const categoryUrls = categories.map((category: Category) => ({
    url: `${domain}/products/${category.slug}`,
    lastModified: category.createdAt,
  }));

  // Add your static pages here
  const staticPages = [
    { route: "", changefreq: "daily", priority: 1.0 },
    { route: "/about", changefreq: "monthly", priority: 0.8 },
    { route: "/contact", changefreq: "monthly", priority: 0.7 },
    { route: "/gallery", changefreq: "weekly", priority: 0.6 },
    { route: "/privacy-policy", changefreq: "yearly", priority: 0.5 },
    { route: "/products", changefreq: "daily", priority: 0.9 },
  ].map(({ route, changefreq, priority }) => ({
    url: `${domain}${route}`,
    lastModified: new Date(),
    changefreq,
    priority,
  }));

  return [...staticPages, ...productUrls, ...categoryUrls];
}
