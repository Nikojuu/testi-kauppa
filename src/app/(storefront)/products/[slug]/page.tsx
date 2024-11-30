import prisma from "@/app/utils/db";
import { ProductCard } from "@/components/ProductCard";
import Subtitle from "@/components/subtitle";

const getData = async (slug: string) => {
  const products = await prisma.product.findMany({
    where: {
      storeId: process.env.TENANT_ID,
      categories: {
        some: {
          slug: slug,
        },
      },
    },
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
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
};

const CategoriesPage = async ({ params }: { params: { slug: string } }) => {
  const data = await getData(params.slug);

  const decodedSlug = decodeURIComponent(params.slug);
  const heading = decodedSlug
    .replace(/-/g, " ")
    .toLocaleLowerCase()
    .replace(/^\w/, (c) => c.toLocaleUpperCase());

  return (
    <>
      {data ? (
        <section className="mt-48">
          <Subtitle subtitle={heading} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-screen-xl mx-auto">
            {data.map((item) => (
              <ProductCard item={item} key={item.id} />
            ))}
          </div>
        </section>
      ) : (
        <p>Tälle kategorialle ei vielä lisätty tuotteita</p>
      )}
    </>
  );
};

export default CategoriesPage;
