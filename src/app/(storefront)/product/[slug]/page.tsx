import { notFound } from "next/navigation";
import prisma from "@/app/utils/db";
import ProductDetail from "@/components/Product/ProductDetail";
import { Metadata, ResolvingMetadata } from "next";

const getData = async (productId: string) => {
  const data = await prisma.product.findUnique({
    where: {
      slug: productId,
      storeId: process.env.TENANT_ID,
    },
    select: {
      id: true,
      name: true,
      description: true,
      categories: true,
      quantity: true,
      price: true,
      images: true,
      metaTitle: true,
      metaDescription: true,
      salePercent: true,
      salePrice: true,
      saleStartDate: true,
      saleEndDate: true,
      ProductVariation: {
        select: {
          id: true,
          images: true,
          price: true,
          description: true,
          quantity: true,
          salePercent: true,
          salePrice: true,
          saleStartDate: true,
          saleEndDate: true,
          VariantOption: {
            select: {
              value: true, // Add this line
              OptionType: {
                select: {
                  name: true, // Ensure name is selected
                },
              },
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }
  return data;
};
type Props = {
  params: { slug: string };
};
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await getData(params.slug);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `Pupun Korvat | ${product.metaTitle || product.name}`,
    description: product.metaDescription || product.description,
    openGraph: {
      title: `Pupun Korvat | ${product.metaTitle || product.name}`,
      description: product.metaDescription || product.description,
      images: [product.images[0], ...previousImages],
    },
  };
}

const ProductIdRoute = async ({ params }: { params: { slug: string } }) => {
  const product = await getData(params.slug);

  return (
    <section className="mt-48 container mx-auto px-4">
      <ProductDetail product={product} />
    </section>
  );
};

export default ProductIdRoute;
