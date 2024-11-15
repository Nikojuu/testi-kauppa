// import prisma from "@/app/utils/db";
// import AddToCartButton from "@/components/Cart/AddToCartButton";
// import { ImageSlider } from "@/components/ImageSlider";
// import { Badge } from "@/components/ui/badge";

// import { notFound } from "next/navigation";

// const getData = async (productId: string) => {
//   const data = await prisma.product.findUnique({
//     where: {
//       id: productId,
//       storeId: process.env.TENANT_ID,
//     },
//     select: {
//       id: true,
//       name: true,
//       description: true,
//       categories: true,
//       price: true,
//       images: true,
//       ProductVariation: {
//         select: {
//           id: true,
//           images: true,
//           price: true,
//           stockQuantity: true,
//           optionName: true,
//           optionValue: true,
//         },
//       },
//     },
//   });

//   if (!data) {
//     return notFound();
//   }
//   return data;
// };

// const ProductIdRoute = async ({ params }: { params: { id: string } }) => {
//   const product = await getData(params.id);

//   return (
//     <>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
//         <ImageSlider images={product.images} />
//         <div>
//           <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
//             {product.name}
//           </h1>
//           {product.categories.map((category) => (
//             <Badge
//               key={category.id}
//               className="mt-2 rounded-lg bg-green-300"
//               variant="outline"
//             >
//               {category.name}
//             </Badge>
//           ))}
//           <p className="text-3xl mt-2 text-gray-900">€{product.price}</p>
//           <p className="text-base text-gray-700 mt-6">{product.description}</p>
//           <AddToCartButton product={product} />
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProductIdRoute;

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

  return <ProductDetail product={product} />;
};

export default ProductIdRoute;
