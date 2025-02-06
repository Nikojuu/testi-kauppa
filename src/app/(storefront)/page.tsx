import { Hero } from "@/components/Hero";
import prisma from "../utils/db";
import Subtitle from "@/components/subtitle";
import AboutMeSection from "@/components/Homepage/AboutMeSection";
import CategorySection from "@/components/Homepage/CategorySection";
import { ProductCard } from "@/components/ProductCard";
import { Metadata } from "next";
import { OPEN_GRAPH_IMAGE, TWITTER_IMAGE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pupun Korvat | Käsintehtyjen korujen verkkokauppa",
  description:
    "Tutustu Pupun Korvien käsintehtyihin koruihin, jotka yhdistävät luonnon kauneuden ja ainutlaatuisen muotoilun. Löydä täydellinen koru itsellesi tai lahjaksi ystävälle. Laadukkaat materiaalit ja ajaton tyyli.",
  keywords:
    "korut, käsintehty, lahjat, lasihelmet, muotoilu, verkkokauppa,uniikit korut, käsityö, korvakorut, kaulakorut, rannekorut, lahja, ystävänpäivä, syntymäpäivä, joulu, äitienpäivä, ystävä, nainen, tyttöystävä, vaimo, äiti, tytär, sisko, ystävyys, rakkaus, kauneus, muoti, tyyli, ajaton, laadukas, kestävä, ekologinen, vastuullinen, kotimainen, suomalainen, design, suunnittelu, käsityöläinen,  käsityöläisyys,suomalainen design,käsityöläinen, ",
  authors: [{ name: "Pupun Korvat" }],
  robots:
    "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",

  openGraph: {
    title: "Pupun Korvat | Käsintehtyjä Koruja",
    description:
      "Käsintehtyjä koruja lasihelmistä. Tutustu Pupun Korvien koruvalikoimaan ja löydä itsellesi sopiva koru tai lahja ystävälle.",
    url: "https://www.pupunkorvat.fi", // Your website URL
    images: [
      {
        url: OPEN_GRAPH_IMAGE, // Main product image
        width: 1200,
        height: 630,
        alt: "Pupun Korvat - Käsintehty koru",
      },
    ],
    locale: "fi_FI",
    type: "website",
    siteName: "Pupun Korvat",
  },

  twitter: {
    card: "summary_large_image",
    title: "Pupun Korvat | Käsintehtyjä Koruja",
    description:
      "Tutustu Pupun Korvien käsintehtyihin koruihin ja löydä ainutlaatuinen lahja tai itsellesi sopiva koru.",
    images: [TWITTER_IMAGE], // Main Twitter image
  },
};

export const revalidate = 3600;
const getHomePageData = async () => {
  const latestProducts = await prisma.product.findMany({
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
      slug: true,
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
  });

  return {
    latestProducts,
  };
};
export default async function Home() {
  const { latestProducts } = await getHomePageData();

  return (
    <div>
      <Hero />

      <Subtitle subtitle="Upeita koruja" />
      <CategorySection />
      <Subtitle subtitle="Uusimmat tuotteet" />
      <div className="container px-4 mx-auto max-w-screen-xl">
        {/* On mobile: horizontal scroll, On md/lg: grid */}
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5">
          {/* Horizontal scroll container for mobile */}
          <div className="flex overflow-x-auto md:hidden space-x-4 pb-4 -mx-4 px-4 snap-x snap-mandatory">
            {latestProducts.map((item) => (
              <div
                key={item.id}
                className="flex-none w-[85%] snap-start first:pl-4 last:pr-4"
              >
                <ProductCard item={item} />
              </div>
            ))}
          </div>

          {/* Grid layout for tablet/desktop */}
          <div className="hidden md:contents">
            {latestProducts.map((item) => (
              <div key={item.id}>
                <ProductCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className=" py-8">
        <Subtitle subtitle="Tietoa minusta" />
        <AboutMeSection />
      </div>
    </div>
  );
}
