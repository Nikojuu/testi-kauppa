import { Hero } from "@/components/Hero";
import prisma from "../utils/db";
import Subtitle from "@/components/subtitle";
import AboutMeSection from "@/components/Homepage/AboutMeSection";
import CategorySection from "@/components/Homepage/CategorySection";
import { ProductCard } from "@/components/ProductCard";

const getHomePageData = async () => {
  const [bannerData, latestProducts] = await Promise.all([
    prisma.banner.findMany({
      where: {
        storeId: process.env.TENANT_ID,
      },
      select: {
        title: true,
        imageString: true,
      },
    }),
    prisma.product.findMany({
      where: {
        storeId: process.env.TENANT_ID,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        salePrice: true,
        salePercent: true,
        saleEndDate: true,
        saleStartDate: true,
        quantity: true,
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
      take: 3, // Limit to 3 latest products
    }),
  ]);

  return {
    bannerData,
    latestProducts,
  };
};

export default async function Home() {
  const { bannerData, latestProducts } = await getHomePageData();
  return (
    <div>
      <Hero carouselData={bannerData} />
      <Subtitle subtitle="Uusimmat tuotteet" />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-screen-xl mx-auto ">
        {latestProducts.map((item) => (
          <ProductCard item={item} key={item.id} />
        ))}
      </div>

      <div className=" py-8">
        <Subtitle subtitle="Tietoa minusta" />
        <AboutMeSection />
        <Subtitle subtitle="Upeita koruja" />
        <CategorySection />
      </div>
    </div>
  );
}
