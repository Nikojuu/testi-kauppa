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
