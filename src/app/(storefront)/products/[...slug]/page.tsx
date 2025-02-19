import {
  ApiResponseProductCardType,
  Category,
  Product,
} from "@/app/utils/types";
import { PaginationComponent } from "@/components/Product/Pagination";
import { SortOptions } from "@/components/Product/SortOptions";
import { ProductCard } from "@/components/ProductCard";
import Subtitle from "@/components/subtitle";
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  type CategoryMetadata = {
    category: Category;
  };
  const slugs = params.slug;
  const categorySlug = slugs[slugs.length - 1]; // Get the last slug for category

  let categoryName = "Tuotteet";

  if (categorySlug && categorySlug !== "all-products") {
    try {
      const categoryMetadata: CategoryMetadata =
        await getCategoryMetadataFromApi(categorySlug); // Fetch category metadata from API

      categoryName = categoryMetadata.category.name || "Tuotteet"; // Use fetched name or default
    } catch (error) {
      console.error("Error fetching category metadata for SEO:", error);
      // Fallback to default name if API call fails -  important to have fallback for SEO
    }
  }

  return {
    title: `Pupun Korvat | ${categoryName} `,
    description: `Tutustu Pupun Korvien tuotteisiin kategoriassa ${categoryName}.`,
    openGraph: {
      title: `Pupun Korvat | ${categoryName} `,
      description: `Tutustu Pupun Korvien tuotteisiin kategoriassa ${categoryName}.`,
      type: "website",
    },
  };
}

const getCategoryMetadataFromApi = async (slug: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/categories/${slug}`,
    {
      headers: {
        "x-api-key": process.env.STOREFRONT_API_KEY || "",
      },
      next: { revalidate: 86400 },
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch category metadata");
  }

  const categoryData = await res.json();
  return categoryData;
};
type SortKey = "newest" | "price_asc" | "price_desc" | "popularity";

// const getProducts = async (
//   slugs?: string[],
//   page = 1,
//   pageSize = 3,
//   sort: SortKey = "newest"
// ) => {
//   const skip = (page - 1) * pageSize;
//   const take = pageSize;

//   const orderBy = sortOptions[sort]; // No error, type-safe access

//   if (!slugs || slugs.length === 0 || slugs[0] === "all-products") {
//     if (sort === "price_asc" || sort === "price_desc") {
//       // Handle sorting by price for all products
//       const orderByPrice = sort === "price_asc" ? "asc" : "desc";

//       const products = await prisma.$queryRaw(
//         Prisma.sql`
//    WITH AllPrices AS (
//   -- Base product prices
//   SELECT
//     p.id as product_id,
//     CASE
//       WHEN p."salePrice" IS NOT NULL AND (
//         -- Either dates are NULL (permanent sale)
//         (p."saleStartDate" IS NULL OR p."saleEndDate" IS NULL) OR
//         -- Or within date range
//         (CURRENT_TIMESTAMP BETWEEN p."saleStartDate" AND p."saleEndDate")
//       )
//       THEN p."salePrice"
//       ELSE p.price
//     END as final_price
//   FROM "Product" p
//   WHERE p."storeId" = ${process.env.TENANT_ID}

//   UNION ALL

//   -- Variation prices with same logic
//   SELECT
//     pv."productId" as product_id,
//     CASE
//       WHEN pv."salePrice" IS NOT NULL AND (
//         -- Either dates are NULL (permanent sale)
//         (pv."saleStartDate" IS NULL OR pv."saleEndDate" IS NULL) OR
//         -- Or within date range
//         (CURRENT_TIMESTAMP BETWEEN pv."saleStartDate" AND pv."saleEndDate")
//       )
//       THEN pv."salePrice"
//       ELSE pv.price
//     END as final_price
//   FROM "ProductVariation" pv
//   JOIN "Product" p ON p.id = pv."productId"
//   WHERE p."storeId" = ${process.env.TENANT_ID}
// ),
// LowestPrices AS (
//   SELECT
//     product_id,
//     MIN(final_price) as lowest_price
//   FROM AllPrices
//   GROUP BY product_id
// )
// SELECT
//   p.id,
//   p.name,
//   p.description,
//   p.price,
//   p.images,
//   p.slug,
//   p.quantity,
//   p."salePrice",
//   p."salePercent",
//   p."saleEndDate",
//   p."saleStartDate",
//   p."soldQuantity",
//   lp.lowest_price as "lowestPrice",
//   COALESCE(
//     json_agg(
//       CASE
//         WHEN pv.id IS NOT NULL THEN
//           json_build_object(
//             'id', pv.id,
//             'price', pv.price,
//             'saleEndDate', pv."saleEndDate",
//             'saleStartDate', pv."saleStartDate",
//             'salePrice', pv."salePrice",
//             'salePercent', pv."salePercent"
//           )
//       END
//     ) FILTER (WHERE pv.id IS NOT NULL),
//     '[]'
//   ) as "ProductVariation"
// FROM "Product" p
// LEFT JOIN "ProductVariation" pv ON pv."productId" = p.id
// JOIN LowestPrices lp ON lp.product_id = p.id
// WHERE p."storeId" = ${process.env.TENANT_ID}
// GROUP BY
//   p.id,
//   p.name,
//   p.description,
//   p.price,
//   p.images,
//   p.slug,
//   p.quantity,
//   p."salePrice",
//   p."salePercent",
//   p."saleEndDate",
//   p."saleStartDate",
//   p."soldQuantity",
//   lp.lowest_price
// ORDER BY lp.lowest_price ${Prisma.raw(orderByPrice)}
// LIMIT ${take}
// OFFSET ${skip};
//   `
//       );

//       return {
//         name: "Kaikki tuotteeni",
//         products,
//       };
//     } else {
//       return {
//         name: "Kaikki tuotteeni",
//         products: await prisma.product.findMany({
//           where: {
//             storeId: process.env.TENANT_ID,
//           },
//           select: {
//             id: true,
//             name: true,
//             description: true,
//             price: true,
//             images: true,
//             slug: true,
//             quantity: true,
//             salePrice: true,
//             salePercent: true,
//             saleEndDate: true,
//             saleStartDate: true,
//             soldQuantity: true,
//             ProductVariation: {
//               select: {
//                 id: true,
//                 price: true,
//                 saleEndDate: true,
//                 saleStartDate: true,
//                 salePrice: true,
//                 salePercent: true,
//               },
//             },
//           },
//           orderBy, // Use dynamic sort option
//           skip,
//           take,
//         }),
//       };
//     }
//   } else {
//     if (sort === "price_asc" || sort === "price_desc") {
//       // Handle sorting by price for a specific category
//       const category = await prisma.category.findFirst({
//         where: {
//           slug: slugs[slugs.length - 1],
//           storeId: process.env.TENANT_ID,
//         },
//       });

//       if (!category) {
//         return {
//           name: "Kategoriaa ei löydy",
//           products: [],
//         };
//       }

//       const orderByPrice = sort === "price_asc" ? "asc" : "desc";

//       const products = await prisma.$queryRaw(
//         Prisma.sql`
//    WITH AllPrices AS (
//       SELECT
//         p.id as product_id,
//         CASE
//           WHEN p."salePrice" IS NOT NULL AND (
//             (p."saleStartDate" IS NULL OR p."saleEndDate" IS NULL) OR
//             (CURRENT_TIMESTAMP BETWEEN p."saleStartDate" AND p."saleEndDate")
//           )
//           THEN p."salePrice"
//           ELSE p.price
//         END as final_price
//       FROM "Product" p
//       JOIN "_CategoryToProduct" ctp ON ctp."B" = p.id
//       WHERE ctp."A" = ${category.id}
//         AND p."storeId" = ${process.env.TENANT_ID}

//       UNION ALL

//       SELECT
//         pv."productId" as product_id,
//         CASE
//           WHEN pv."salePrice" IS NOT NULL AND (
//             (pv."saleStartDate" IS NULL OR pv."saleEndDate" IS NULL) OR
//             (CURRENT_TIMESTAMP BETWEEN pv."saleStartDate" AND pv."saleEndDate")
//           )
//           THEN pv."salePrice"
//           ELSE pv.price
//         END as final_price
//       FROM "ProductVariation" pv
//       JOIN "Product" p ON p.id = pv."productId"
//       JOIN "_CategoryToProduct" ctp ON ctp."B" = p.id
//       WHERE ctp."A" = ${category.id}
//         AND p."storeId" = ${process.env.TENANT_ID}
//    ),
//    LowestPrices AS (
//       SELECT
//         product_id,
//         MIN(final_price) as lowest_price
//       FROM AllPrices
//       GROUP BY product_id
//    )
//    SELECT
//       p.id,
//       p.name,
//       p.description,
//       p.price,
//       p.images,
//       p.slug,
//       p.quantity,
//       p."salePrice",
//       p."salePercent",
//       p."saleEndDate",
//       p."saleStartDate",
//       p."soldQuantity",
//       lp.lowest_price as "lowestPrice",
//       COALESCE(
//         json_agg(
//           CASE
//             WHEN pv.id IS NOT NULL THEN
//               json_build_object(
//                 'id', pv.id,
//                 'price', pv.price,
//                 'saleEndDate', pv."saleEndDate",
//                 'saleStartDate', pv."saleStartDate",
//                 'salePrice', pv."salePrice",
//                 'salePercent', pv."salePercent"
//               )
//           END
//         ) FILTER (WHERE pv.id IS NOT NULL),
//         '[]'
//       ) as "ProductVariation"
//    FROM "Product" p
//    LEFT JOIN "ProductVariation" pv ON pv."productId" = p.id
//    JOIN LowestPrices lp ON lp.product_id = p.id
//    JOIN "_CategoryToProduct" ctp ON ctp."B" = p.id
//    WHERE ctp."A" = ${category.id}
//      AND p."storeId" = ${process.env.TENANT_ID}
//    GROUP BY
//       p.id,
//       p.name,
//       p.description,
//       p.price,
//       p.images,
//       p.slug,
//       p.quantity,
//       p."salePrice",
//       p."salePercent",
//       p."saleEndDate",
//       p."saleStartDate",
//       p."soldQuantity",
//       lp.lowest_price
//    ORDER BY lp.lowest_price ${Prisma.raw(orderByPrice)}
//    LIMIT ${take}
//    OFFSET ${skip};
//    `
//       );

//       return {
//         name: category.name,
//         products,
//       };
//     } else {
//       const category = await prisma.category.findFirst({
//         where: {
//           slug: slugs[slugs.length - 1],
//           storeId: process.env.TENANT_ID,
//         },
//         include: {
//           products: {
//             select: {
//               id: true,
//               name: true,
//               description: true,
//               price: true,
//               images: true,
//               slug: true,
//               quantity: true,
//               salePrice: true,
//               salePercent: true,
//               saleEndDate: true,
//               saleStartDate: true,
//               soldQuantity: true,
//               ProductVariation: {
//                 select: {
//                   id: true,
//                   price: true,
//                   saleEndDate: true,
//                   saleStartDate: true,
//                   salePrice: true,
//                   salePercent: true,
//                 },
//               },
//             },
//             orderBy, // Use dynamic sort option
//             skip,
//             take,
//           },
//         },
//       });

//       return {
//         name: category?.name || "Tuotteet",
//         products: category?.products || [],
//       };
//     }
//   }
// };
const getProductsDataFromApi = async (
  slugs: string[],
  page: number,
  pageSize: number,
  sort: string
) => {
  // Use new API response type
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    sort: sort,
  });
  slugs.forEach((slug) => params.append("slugs", slug)); // Append all slugs

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/filtered-products?${params.toString()}`,
    {
      headers: {
        "x-api-key": process.env.STOREFRONT_API_KEY || "",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch products");
  }

  const productPageData = await res.json();
  return productPageData;
};

const getProductsCountFromApi = async (slugs: string[]): Promise<number> => {
  const params = new URLSearchParams();
  slugs.forEach((slug) => params.append("slugs", slug)); // Append all slugs

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/products-count?${params.toString()}`,
    {
      headers: {
        "x-api-key": process.env.STOREFRONT_API_KEY || "",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch product count");
  }

  const countData = await res.json(); // Use new type
  return countData.count; // Extract count from response
};

const ProductsPage = async ({
  params,
  searchParams,
}: {
  params: { slug?: string[] };
  searchParams: { page?: string; sort?: string };
}) => {
  noStore();
  const slugs = params.slug ?? ["all-products"];
  const pageSize = 12;
  const currentPage = Number(searchParams.page) || 1;
  const sort = (searchParams.sort as SortKey) || "newest";

  const [productPageData, totalCount] = await Promise.all([
    // Fetch both products and count in parallel
    getProductsDataFromApi(slugs, currentPage, pageSize, sort),
    getProductsCountFromApi(slugs), // Fetch product count from API
  ]);

  const products: Product[] = productPageData?.products as Product[];
  const categoryName = productPageData?.name;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <section className="mt-24 md:mt-48 container mx-auto px-4">
      <Subtitle subtitle={categoryName || "Tuotteet"} />
      {products && products.length > 0 ? (
        <>
          <div className="max-w-screen-xl mx-auto flex justify-end my-4">
            <SortOptions />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 max-w-screen-xl mx-auto my-8">
            {products.map((item: Product) => (
              <ProductCard
                item={item as ApiResponseProductCardType}
                key={item.id}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="my-8 ">
              <PaginationComponent
                totalPages={totalPages}
                currentPage={currentPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="mx-auto max-w-screen-2xl">
          <h3>Tällä kategorialla ei löydy tuotteita</h3>
        </div>
      )}
    </section>
  );
};

export default ProductsPage;
