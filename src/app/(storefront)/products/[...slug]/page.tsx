import prisma from "@/app/utils/db";
import { ProductCard } from "@/components/ProductCard";
import Subtitle from "@/components/subtitle";

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

const ProductsPage = async ({ params }: { params: { slug: string[] } }) => {
  const category = await getCategory(params.slug);
  const heading = category?.name || "Products";

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
