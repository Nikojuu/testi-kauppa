import { notFound } from "next/navigation";
import prisma from "@/app/utils/db";
import ProductDetail from "@/components/Product/ProductDetail";

const getData = async (productId: string) => {
  const data = await prisma.product.findUnique({
    where: {
      id: productId,
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
          optionName: true,
          optionValue: true,
          salePercent: true,
          salePrice: true,
          saleStartDate: true,
          saleEndDate: true,
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }
  return data;
};

const ProductIdRoute = async ({ params }: { params: { id: string } }) => {
  const product = await getData(params.id);

  return (
    <section className="mt-48">
      <ProductDetail product={product} />;
    </section>
  );
};

export default ProductIdRoute;
