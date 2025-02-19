import { notFound } from "next/navigation";
import ProductDetail from "@/components/Product/ProductDetail";
import { Metadata, ResolvingMetadata } from "next";

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
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await getProductDataFromApi(params.slug);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Pupun Korvat | ${product.metaTitle || product.name}`,
    description: product.metaDescription || product.description,
    openGraph: {
      title: `Pupun Korvat | ${product.metaTitle || product.name}`,
      description: product.metaDescription || product.description,
      images: product.images
        ? [product.images[0], ...previousImages]
        : previousImages,
    },
  };
}

const ProductIdRoute = async ({ params }: { params: { slug: string } }) => {
  const product = await getProductDataFromApi(params.slug);

  return (
    <section className="mt-24 md:mt-48 container mx-auto px-4">
      <ProductDetail product={product} />
    </section>
  );
};

export default ProductIdRoute;
