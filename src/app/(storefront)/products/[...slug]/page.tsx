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
import CollectionPageSchema from "@/components/StructuredData/CollectionPageSchema";
import BreadcrumbSchema from "@/components/StructuredData/BreadcrumbSchema";
import { STORE_NAME, STORE_DOMAIN } from "@/app/utils/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  type CategoryMetadata = {
    category: Category;
  };
  const { slug } = await params;
  const slugs = slug;
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

  const categoryUrl = `${STORE_DOMAIN}/products/${slugs.join("/")}`;

  return {
    title: `${STORE_NAME} | ${categoryName}`,
    description: `Tutustu ${STORE_NAME} verkkokaupan tuotteisiin kategoriassa ${categoryName}.`,
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      title: `${STORE_NAME} | ${categoryName}`,
      description: `Tutustu ${STORE_NAME} verkkokaupan tuotteisiin kategoriassa ${categoryName}.`,
      url: categoryUrl,
      siteName: STORE_NAME,
      locale: "fi_FI",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${STORE_NAME} | ${categoryName}`,
      description: `Tutustu ${STORE_NAME} verkkokaupan tuotteisiin kategoriassa ${categoryName}.`,
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
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    sort: sort,
  });
  slugs.forEach((slug) => params.append("slugs", slug));

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/sorted-products?${params.toString()}`,
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

const ProductsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}) => {
  noStore();
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const slugs = slug ?? ["all-products"];
  const pageSize = 12;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const sort = (resolvedSearchParams.sort as SortKey) || "newest";

  // Single API call - totalCount included in response
  const productPageData = await getProductsDataFromApi(
    slugs,
    currentPage,
    pageSize,
    sort
  );

  const products: Product[] = productPageData?.products as Product[];
  const categoryName = productPageData?.name;
  const totalCount = productPageData?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Build breadcrumb items
  const breadcrumbItems = [
    { name: "Etusivu", url: STORE_DOMAIN },
    { name: "Tuotteet", url: `${STORE_DOMAIN}/products` },
  ];

  if (slugs[0] !== "all-products") {
    breadcrumbItems.push({
      name: categoryName || "Kategoria",
      url: `${STORE_DOMAIN}/products/${slugs.join("/")}`,
    });
  }

  return (
    <>
      {products && products.length > 0 && (
        <>
          <BreadcrumbSchema items={breadcrumbItems} />
          <CollectionPageSchema
            name={categoryName || "Tuotteet"}
            description={`Tutustu ${STORE_NAME} verkkokaupan tuotteisiin kategoriassa ${categoryName}.`}
            products={products as ApiResponseProductCardType[]}
            categorySlug={slugs.join("/")}
            totalCount={totalCount}
          />
        </>
      )}
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
    </>
  );
};

export default ProductsPage;
