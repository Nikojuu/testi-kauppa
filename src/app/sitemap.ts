// import { MetadataRoute } from "next";

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   // Fetch all products
//   const products = await prisma.product.findMany({
//     where: { storeId: process.env.TENANT_ID },
//     select: { slug: true, createdAt: true },
//   });

//   // Fetch all categories
//   const categories = await prisma.category.findMany({
//     where: { storeId: process.env.TENANT_ID },
//     select: { slug: true, createdAt: true },
//   });

//   const productUrls = products.map((product) => ({
//     url: `${process.env.BASE_URL}/product/${product.slug}`,
//     lastModified: product.createdAt,
//   }));

//   const categoryUrls = categories.map((category) => ({
//     url: `${process.env.BASE_URL}/products/${category.slug}`,
//     lastModified: category.createdAt,
//   }));

//   // Add your static pages here
//   const staticPages = [
//     { route: "", changefreq: "daily", priority: 1.0 },
//     { route: "/about", changefreq: "monthly", priority: 0.8 },
//     { route: "/contact", changefreq: "monthly", priority: 0.7 },
//     { route: "/gallery", changefreq: "weekly", priority: 0.6 },
//     { route: "/privacy-policy", changefreq: "yearly", priority: 0.5 },
//     { route: "/products", changefreq: "daily", priority: 0.9 },
//   ].map(({ route, changefreq, priority }) => ({
//     url: `${process.env.BASE_URL}${route}`,
//     lastModified: new Date(2024, 0, 1),
//     changefreq,
//     priority,
//   }));

//   return [...staticPages, ...productUrls, ...categoryUrls];
// }
