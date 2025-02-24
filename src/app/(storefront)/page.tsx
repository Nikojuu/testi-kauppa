import Hero from "@/components/Hero";
import Subtitle from "@/components/subtitle";
import AboutMeSection from "@/components/Homepage/AboutMeSection";
import CategorySection from "@/components/Homepage/CategorySection";
import { ProductCard } from "@/components/ProductCard";
import { Metadata } from "next";
import { OPEN_GRAPH_IMAGE, TWITTER_IMAGE } from "@/lib/utils";
import { ProductCarousel } from "@/components/Product/ProductCarousel";
import { ApiResponseProductCardType } from "../utils/types";

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

const getHomePageData = async (
  take: number
): Promise<{ latestProducts: ApiResponseProductCardType[] }> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL || "https://putiikkipalvelu.fi"}/api/storefront/v1/latest-products?take=${take}`,
    {
      headers: {
        "x-api-key": process.env.STOREFRONT_API_KEY || "",
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to fetch products"); // Throw an error for the component to handle
  }

  const latestProducts: ApiResponseProductCardType[] = await res.json();

  return { latestProducts };
};
export default async function Home() {
  const { latestProducts } = await getHomePageData(3);

  return (
    <div>
      <Hero />

      <Subtitle subtitle="Myy mitä vain!" />
      <CategorySection />
      <Subtitle subtitle="Uusimmat tuotteet" />
      <div className="hidden sm:grid grid-cols-3 gap-5 max-w-screen-xl mx-auto container px-4">
        {latestProducts.map((item) => (
          <ProductCard item={item} key={item.id} />
        ))}
      </div>
      <ProductCarousel products={latestProducts} />

      <div className=" py-8">
        <Subtitle subtitle="Kerro hieman kaupastasi" />
        <AboutMeSection />
      </div>
    </div>
  );
}
