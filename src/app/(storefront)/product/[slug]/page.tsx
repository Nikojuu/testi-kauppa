import { notFound } from "next/navigation";
import ProductDetail from "@/components/Product/ProductDetail";
import { Metadata, ResolvingMetadata } from "next";
import ProductSchema from "@/components/StructuredData/ProductSchema";
import BreadcrumbSchema from "@/components/StructuredData/BreadcrumbSchema";
import { STORE_NAME, STORE_DOMAIN } from "@/app/utils/constants";

const getProductDataFromApi = async (slug: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/product/${slug}`,
    {
      headers: {
        "x-api-key": process.env.STOREFRONT_API_KEY || "",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    if (res.status === 404) {
      notFound(); // Use Next.js notFound() to handle 404s
    }
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch product details");
  }

  const productData = await res.json();
  return productData;
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDataFromApi(slug);

  const previousImages = (await parent).openGraph?.images || [];
  const productUrl = `${STORE_DOMAIN}/product/${slug}`;

  return {
    title: `${STORE_NAME} | ${product.metaTitle || product.name}`,
    description: product.metaDescription || product.description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${STORE_NAME} | ${product.metaTitle || product.name}`,
      description: product.metaDescription || product.description,
      url: productUrl,
      siteName: STORE_NAME,
      locale: "fi_FI",
      type: "website",
      images: product.images
        ? [product.images[0], ...previousImages]
        : previousImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${STORE_NAME} | ${product.metaTitle || product.name}`,
      description: product.metaDescription || product.description,
      images: product.images ? [product.images[0]] : [],
    },
  };
}

const ProductIdRoute = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const product = await getProductDataFromApi(slug);

  // Build breadcrumb items
  const breadcrumbItems = [
    { name: "Etusivu", url: STORE_DOMAIN },
    { name: "Tuotteet", url: `${STORE_DOMAIN}/products` },
  ];

  // Add category to breadcrumb if available
  if (product.categories && product.categories.length > 0) {
    const category = product.categories[0];
    breadcrumbItems.push({
      name: category.name,
      url: `${STORE_DOMAIN}/products/${category.slug}`,
    });
  }

  // Add product name as final breadcrumb
  breadcrumbItems.push({
    name: product.name,
    url: `${STORE_DOMAIN}/product/${slug}`,
  });

  return (
    <>
      <ProductSchema product={product} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <section className="mt-24 md:mt-48 container mx-auto px-4">
        <ProductDetail product={product} />
      </section>
    </>
  );
};

export default ProductIdRoute;
