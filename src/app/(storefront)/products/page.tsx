import prisma from "@/app/utils/db";
import { ProductCard } from "@/components/ProductCard";
import Subtitle from "@/components/subtitle";

const getData = async () => {
  const products = await prisma.product.findMany({
    where: {
      storeId: process.env.TENANT_ID,
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

const ProductsPage = async () => {
  const data = await getData();

  return (
    <div className="mt-48">
      <Subtitle subtitle="Kaikki tuotteeni" />
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-screen-xl mx-auto">
        {data.map((item) => (
          <ProductCard item={item} key={item.id} />
        ))}
      </section>
    </div>
  );
};

export default ProductsPage;
