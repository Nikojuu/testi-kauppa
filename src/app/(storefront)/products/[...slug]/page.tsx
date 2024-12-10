import prisma from "@/app/utils/db";
import { ProductCard } from "@/components/ProductCard";
import Subtitle from "@/components/subtitle";
import { Metadata, ResolvingMetadata } from "next";
type Props = {
  params: { slug: string[] };
};

const getCategory = async (slugs: string[]) => {
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
      },
    },
  });
  return category;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const category = await getCategory(params.slug);

  if (!category) {
    return {
      title: "Kategoriaa ei löytynyt | Pupun Korvat",
      description: "Tällä kategorialla ei löydy tuotteita",
    };
  }

  const title = `${category.name} | Pupun Korvat`;
  const description = `Etsi tuotteita kategorian ${category.name.toLowerCase()} tuotteet.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: category.products[0]?.images[0]
        ? [category.products[0].images[0]]
        : [],
    },
  };
}

const ProductsPage = async ({ params }: { params: { slug: string[] } }) => {
  const category = await getCategory(params.slug);
  const heading = category?.name || "Tuotteet";

  return (
    <>
      {category ? (
        <section className="mt-48">
          <Subtitle subtitle={heading} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-screen-xl mx-auto">
            {category.products.map((item) => (
              <ProductCard item={item} key={item.id} />
            ))}
          </div>
        </section>
      ) : (
        <p>Tällä kategorialla ei löydy tuotteita</p>
      )}
    </>
  );
};

export default ProductsPage;
