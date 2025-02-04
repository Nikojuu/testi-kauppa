import prisma from "@/app/utils/db";
import { Product } from "@/app/utils/types";
import { PaginationComponent } from "@/components/Product/Pagination";
import { SortOptions } from "@/components/Product/SortOptions";
import { ProductCard } from "@/components/ProductCard";
import Subtitle from "@/components/subtitle";
import { Prisma } from "@prisma/client";
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const slugs = params.slug;

  // Fetch category based on slug
  const category = await prisma.category.findFirst({
    where: {
      slug: slugs[slugs.length - 1],
      storeId: process.env.TENANT_ID,
    },
  });

  return {
    title: `Pupun Korvat | ${category?.name || "Tuotteet"} `,
    description: `Tutustu Pupun Korvien tuotteisiin kategoriassa ${
      category?.name || "Tuotteet"
    }.`,
    openGraph: {
      title: `Pupun Korvat | ${category?.name || "Tuotteet"} `,
      description: `Tutustu Pupun Korvien tuotteisiin kategoriassa ${
        category?.name || "Tuotteet"
      }.`,
      type: "website",
    },
  };
}

const getProductsCount = async (slugs?: string[]) => {
  if (!slugs || slugs.length === 0 || slugs[0] === "all-products") {
    return await prisma.product.count({
      where: {
        storeId: process.env.TENANT_ID,
      },
    });
  } else {
    // Get count for a specific category
    const category = await prisma.category.findFirst({
      where: {
        slug: slugs[slugs.length - 1],
        storeId: process.env.TENANT_ID,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return category?._count?.products || 0;
  }
};

type SortKey = "newest" | "price_asc" | "price_desc" | "popularity";

const sortOptions: Record<SortKey, Record<string, "asc" | "desc">> = {
  newest: { createdAt: "desc" },
  price_asc: { price: "asc" },
  price_desc: { price: "desc" },
  popularity: { soldQuantity: "desc" },
};

const getProducts = async (
  slugs?: string[],
  page = 1,
  pageSize = 3,
  sort: SortKey = "newest"
) => {
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const orderBy = sortOptions[sort]; // No error, type-safe access

  if (!slugs || slugs.length === 0 || slugs[0] === "all-products") {
    if (sort === "price_asc" || sort === "price_desc") {
      // Handle sorting by price for all products
      const orderByPrice = sort === "price_asc" ? "asc" : "desc";

      const products = await prisma.$queryRaw(
        Prisma.sql`
   WITH AllPrices AS (
  -- Base product prices
  SELECT
    p.id as product_id,
    CASE
      WHEN p."salePrice" IS NOT NULL AND (
        -- Either dates are NULL (permanent sale)
        (p."saleStartDate" IS NULL OR p."saleEndDate" IS NULL) OR
        -- Or within date range
        (CURRENT_TIMESTAMP BETWEEN p."saleStartDate" AND p."saleEndDate")
      )
      THEN p."salePrice"
      ELSE p.price
    END as final_price
  FROM "Product" p
  WHERE p."storeId" = ${process.env.TENANT_ID}
 
  UNION ALL
 
  -- Variation prices with same logic
  SELECT
    pv."productId" as product_id,
    CASE
      WHEN pv."salePrice" IS NOT NULL AND (
        -- Either dates are NULL (permanent sale)
        (pv."saleStartDate" IS NULL OR pv."saleEndDate" IS NULL) OR
        -- Or within date range
        (CURRENT_TIMESTAMP BETWEEN pv."saleStartDate" AND pv."saleEndDate")
      )
      THEN pv."salePrice"
      ELSE pv.price
    END as final_price
  FROM "ProductVariation" pv
  JOIN "Product" p ON p.id = pv."productId"
  WHERE p."storeId" = ${process.env.TENANT_ID}
),
LowestPrices AS (
  SELECT
    product_id,
    MIN(final_price) as lowest_price
  FROM AllPrices
  GROUP BY product_id
)
SELECT
  p.id,
  p.name,
  p.description,
  p.price,
  p.images,
  p.slug,
  p.quantity,
  p."salePrice",
  p."salePercent",
  p."saleEndDate",
  p."saleStartDate",
  p."soldQuantity",
  lp.lowest_price as "lowestPrice",
  COALESCE(
    json_agg(
      CASE
        WHEN pv.id IS NOT NULL THEN
          json_build_object(
            'id', pv.id,
            'price', pv.price,
            'saleEndDate', pv."saleEndDate",
            'saleStartDate', pv."saleStartDate",
            'salePrice', pv."salePrice",
            'salePercent', pv."salePercent"
          )
      END
    ) FILTER (WHERE pv.id IS NOT NULL),
    '[]'
  ) as "ProductVariation"
FROM "Product" p
LEFT JOIN "ProductVariation" pv ON pv."productId" = p.id
JOIN LowestPrices lp ON lp.product_id = p.id
WHERE p."storeId" = ${process.env.TENANT_ID}
GROUP BY
  p.id,
  p.name,
  p.description,
  p.price,
  p.images,
  p.slug,
  p.quantity,
  p."salePrice",
  p."salePercent",
  p."saleEndDate",
  p."saleStartDate",
  p."soldQuantity",
  lp.lowest_price
ORDER BY lp.lowest_price ${Prisma.raw(orderByPrice)}
LIMIT ${take}
OFFSET ${skip};
  `
      );

      return {
        name: "Kaikki tuotteeni",
        products,
      };
    } else {
      return {
        name: "Kaikki tuotteeni",
        products: await prisma.product.findMany({
          where: {
            storeId: process.env.TENANT_ID,
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            images: true,
            slug: true,
            quantity: true,
            salePrice: true,
            salePercent: true,
            saleEndDate: true,
            saleStartDate: true,
            soldQuantity: true,
            ProductVariation: {
              select: {
                id: true,
                price: true,
                saleEndDate: true,
                saleStartDate: true,
                salePrice: true,
                salePercent: true,
              },
            },
          },
          orderBy, // Use dynamic sort option
          skip,
          take,
        }),
      };
    }
  } else {
    if (sort === "price_asc" || sort === "price_desc") {
      // Handle sorting by price for a specific category
      const category = await prisma.category.findFirst({
        where: {
          slug: slugs[slugs.length - 1],
          storeId: process.env.TENANT_ID,
        },
      });

      if (!category) {
        return {
          name: "Kategoriaa ei löydy",
          products: [],
        };
      }

      const orderByPrice = sort === "price_asc" ? "asc" : "desc";

      const products = await prisma.$queryRaw(
        Prisma.sql`
   WITH AllPrices AS (
      SELECT
        p.id as product_id,
        CASE
          WHEN p."salePrice" IS NOT NULL AND (
            (p."saleStartDate" IS NULL OR p."saleEndDate" IS NULL) OR
            (CURRENT_TIMESTAMP BETWEEN p."saleStartDate" AND p."saleEndDate")
          )
          THEN p."salePrice"
          ELSE p.price
        END as final_price
      FROM "Product" p
      JOIN "_CategoryToProduct" ctp ON ctp."B" = p.id
      WHERE ctp."A" = ${category.id}
        AND p."storeId" = ${process.env.TENANT_ID}

      UNION ALL

      SELECT
        pv."productId" as product_id,
        CASE
          WHEN pv."salePrice" IS NOT NULL AND (
            (pv."saleStartDate" IS NULL OR pv."saleEndDate" IS NULL) OR
            (CURRENT_TIMESTAMP BETWEEN pv."saleStartDate" AND pv."saleEndDate")
          )
          THEN pv."salePrice"
          ELSE pv.price
        END as final_price
      FROM "ProductVariation" pv
      JOIN "Product" p ON p.id = pv."productId"
      JOIN "_CategoryToProduct" ctp ON ctp."B" = p.id
      WHERE ctp."A" = ${category.id}
        AND p."storeId" = ${process.env.TENANT_ID}
   ),
   LowestPrices AS (
      SELECT
        product_id,
        MIN(final_price) as lowest_price
      FROM AllPrices
      GROUP BY product_id
   )
   SELECT
      p.id,
      p.name,
      p.description,
      p.price,
      p.images,
      p.slug,
      p.quantity,
      p."salePrice",
      p."salePercent",
      p."saleEndDate",
      p."saleStartDate",
      p."soldQuantity",
      lp.lowest_price as "lowestPrice",
      COALESCE(
        json_agg(
          CASE
            WHEN pv.id IS NOT NULL THEN
              json_build_object(
                'id', pv.id,
                'price', pv.price,
                'saleEndDate', pv."saleEndDate",
                'saleStartDate', pv."saleStartDate",
                'salePrice', pv."salePrice",
                'salePercent', pv."salePercent"
              )
          END
        ) FILTER (WHERE pv.id IS NOT NULL),
        '[]'
      ) as "ProductVariation"
   FROM "Product" p
   LEFT JOIN "ProductVariation" pv ON pv."productId" = p.id
   JOIN LowestPrices lp ON lp.product_id = p.id
   JOIN "_CategoryToProduct" ctp ON ctp."B" = p.id
   WHERE ctp."A" = ${category.id}
     AND p."storeId" = ${process.env.TENANT_ID}
   GROUP BY
      p.id,
      p.name,
      p.description,
      p.price,
      p.images,
      p.slug,
      p.quantity,
      p."salePrice",
      p."salePercent",
      p."saleEndDate",
      p."saleStartDate",
      p."soldQuantity",
      lp.lowest_price
   ORDER BY lp.lowest_price ${Prisma.raw(orderByPrice)}
   LIMIT ${take}
   OFFSET ${skip};
   `
      );

      return {
        name: category.name,
        products,
      };
    } else {
      const category = await prisma.category.findFirst({
        where: {
          slug: slugs[slugs.length - 1],
          storeId: process.env.TENANT_ID,
        },
        include: {
          products: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              images: true,
              slug: true,
              quantity: true,
              salePrice: true,
              salePercent: true,
              saleEndDate: true,
              saleStartDate: true,
              soldQuantity: true,
              ProductVariation: {
                select: {
                  id: true,
                  price: true,
                  saleEndDate: true,
                  saleStartDate: true,
                  salePrice: true,
                  salePercent: true,
                },
              },
            },
            orderBy, // Use dynamic sort option
            skip,
            take,
          },
        },
      });

      return {
        name: category?.name || "Tuotteet",
        products: category?.products || [],
      };
    }
  }
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
  const sort = (searchParams.sort as SortKey) || "newest"; // Default to "newest"

  const [data, totalCount] = await Promise.all([
    getProducts(slugs, currentPage, pageSize, sort),
    getProductsCount(slugs),
  ]);
  const totalPages = Math.ceil(totalCount / pageSize);

  const products: Product[] = data?.products as Product[];

  return (
    <section className="mt-48 container mx-auto px-4">
      <Subtitle subtitle={data?.name || "Tuotteet"} />
      {products && products.length > 0 ? (
        <>
          <div className="max-w-screen-xl mx-auto flex justify-end my-4">
            <SortOptions />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-screen-xl mx-auto my-8">
            {products.map((item: Product) => (
              <ProductCard item={item} key={item.id} />
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
