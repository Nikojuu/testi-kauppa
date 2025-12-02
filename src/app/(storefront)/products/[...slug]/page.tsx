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
import {
  getStoreConfig,
  getSEOValue,
  SEO_FALLBACKS,
} from "@/lib/actions/storeConfigActions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  type CategoryMetadata = {
    category: Category;
  };

  try {
    const config = await getStoreConfig();
    const domain = getSEOValue(config.seo.domain, SEO_FALLBACKS.domain);

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

    const categoryUrl = `${domain}/products/${slugs.join("/")}`;

    return {
      title: `${config.store.name} | ${categoryName}`,
      description: `Tutustu ${config.store.name} verkkokaupan tuotteisiin kategoriassa ${categoryName}.`,
      alternates: {
        canonical: categoryUrl,
      },
      openGraph: {
        title: `${config.store.name} | ${categoryName}`,
        description: `Tutustu ${config.store.name} verkkokaupan tuotteisiin kategoriassa ${categoryName}.`,
        url: categoryUrl,
        siteName: config.store.name,
        locale: "fi_FI",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${config.store.name} | ${categoryName}`,
        description: `Tutustu ${config.store.name} verkkokaupan tuotteisiin kategoriassa ${categoryName}.`,
      },
    };
  } catch (error) {
    console.error("Error generating category metadata:", error);

    return {
      title: "Tuotteet",
      description: "Tutustu tuotevalikoimaamme.",
      robots: "noindex, nofollow",
    };
  }
}

const getCategoryMetadataFromApi = async (slug: string) => {
  // Decode the slug to handle special characters like ä, ö, €, etc.
  const decodedSlug = decodeURIComponent(slug);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/categories/${encodeURIComponent(decodedSlug)}`,
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

  // Get store config from backend
  const config = await getStoreConfig();
  const domain = getSEOValue(config.seo.domain, SEO_FALLBACKS.domain);

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
    { name: "Etusivu", url: domain },
    { name: "Tuotteet", url: `${domain}/products` },
  ];

  if (slugs[0] !== "all-products") {
    breadcrumbItems.push({
      name: categoryName || "Kategoria",
      url: `${domain}/products/${slugs.join("/")}`,
    });
  }

  return (
    <>
      {products && products.length > 0 && (
        <>
          <BreadcrumbSchema items={breadcrumbItems} />
          <CollectionPageSchema
            name={categoryName || "Tuotteet"}
            description={`Tutustu ${config.store.name} verkkokaupan tuotteisiin kategoriassa ${categoryName}.`}
            products={products as ApiResponseProductCardType[]}
            categorySlug={slugs.join("/")}
            totalCount={totalCount}
          />
        </>
      )}
      <section className="pt-8 md:pt-16 container mx-auto px-4 bg-warm-white">
        <Subtitle subtitle={categoryName || "Tuotteet"} />
        {products && products.length > 0 ? (
          <>
            <div className="max-w-screen-xl mx-auto flex justify-end my-4">
              <SortOptions />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-screen-xl mx-auto my-8">
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
          <div className="max-w-screen-xl mx-auto py-16 md:py-24">
            <div className="relative bg-warm-white p-8 md:p-12 text-center">
              {/* Card frame */}
              <div className="absolute inset-0 border border-rose-gold/10 pointer-events-none" />

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-rose-gold/30" />
              <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-rose-gold/30" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-rose-gold/30" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-rose-gold/30" />

              {/* Diamond decoration */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 bg-champagne/50 diamond-shape" />
                <div className="w-12 h-[1px] bg-gradient-to-r from-rose-gold/40 to-transparent" />
                <div className="w-2 h-2 bg-rose-gold/40 diamond-shape" />
                <div className="w-12 h-[1px] bg-gradient-to-l from-rose-gold/40 to-transparent" />
                <div className="w-1.5 h-1.5 bg-champagne/50 diamond-shape" />
              </div>

              <h3 className="text-xl md:text-2xl font-primary font-semibold text-charcoal mb-4">
                Tuotteita ei löytynyt
              </h3>
              <p className="text-sm md:text-base font-secondary text-charcoal/60 max-w-md mx-auto">
                Tällä kategorialla ei ole vielä tuotteita. Tutustu muihin
                kategorioihin.
              </p>

              {/* Bottom line */}
              <div className="mt-6 h-[1px] bg-gradient-to-r from-transparent via-rose-gold/20 to-transparent max-w-xs mx-auto" />
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ProductsPage;
