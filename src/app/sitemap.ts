import { MetadataRoute } from "next";
import prisma from "@/app/utils/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all products
  const products = await prisma.product.findMany({
    where: { storeId: process.env.TENANT_ID },
    select: { slug: true, createdAt: true },
  });

  // Fetch all categories
  const categories = await prisma.category.findMany({
    where: { storeId: process.env.TENANT_ID },
    select: { slug: true, createdAt: true },
  });

  const productUrls = products.map((product) => ({
    url: `${process.env.BASE_URL}/product/${product.slug}`,
    lastModified: product.createdAt,
  }));

  const categoryUrls = categories.map((category) => ({
    url: `${process.env.BASE_URL}/products/${category.slug}`,
    lastModified: category.createdAt,
  }));

  // Add your static pages here
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/gallery",
    "/privacy-policy",
    "/products",
  ].map((route) => ({
    url: `${process.env.BASE_URL}${route}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...productUrls, ...categoryUrls];
}
