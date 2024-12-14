import prisma from "@/app/utils/db";
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

  return (
    <section className="mt-48">
      <Subtitle subtitle={data?.name || "Tuotteet"} />
      {data?.products && data.products.length > 0 ? (
        <>
          <div className="max-w-screen-xl mx-auto flex justify-end my-4">
            <SortOptions />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-screen-xl mx-auto my-8">
            {data.products.map((item) => (
              <ProductCard item={item} key={item.id} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8">
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
