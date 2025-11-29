import Hero from "@/components/Hero";
import Subtitle from "@/components/subtitle";
import AboutMeSection from "@/components/Homepage/AboutMeSection";
import CategorySection from "@/components/Homepage/CategorySection";
import { ProductCard } from "@/components/ProductCard";
import { Metadata } from "next";
import { ProductCarousel } from "@/components/Product/ProductCarousel";
import { ApiResponseProductCardType } from "../utils/types";
import { getStoreConfig, getSEOValue, SEO_FALLBACKS } from "@/lib/actions/storeConfigActions";
import { SEO_ENABLED } from "../utils/constants";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const config = await getStoreConfig();

    const title = getSEOValue(config.seo.seoTitle, `${config.store.name} | Verkkokauppa`);
    const description = getSEOValue(
      config.seo.seoDescription,
      `Tutustu ${config.store.name} valikoimaan. ${SEO_FALLBACKS.description}`
    );
    const domain = getSEOValue(config.seo.domain, SEO_FALLBACKS.domain);
    const ogImage = getSEOValue(config.seo.openGraphImageUrl, SEO_FALLBACKS.openGraphImage);
    const twitterImage = getSEOValue(config.seo.twitterImageUrl, SEO_FALLBACKS.twitterImage);

    return {
      title,
      description,
      robots: SEO_ENABLED
        ? "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        : "noindex, nofollow",
      alternates: {
        canonical: domain,
      },
      openGraph: {
        title,
        description,
        url: domain,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: "fi_FI",
        type: "website",
        siteName: config.store.name,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [twitterImage],
      },
    };
  } catch (error) {
    console.error("Error generating homepage metadata:", error);

    // Fallback metadata
    return {
      title: SEO_FALLBACKS.title,
      description: SEO_FALLBACKS.description,
      robots: "noindex, nofollow",
    };
  }
}

export const revalidate = 3600;

const getHomePageData = async (
  take: number
): Promise<{
  latestProducts: ApiResponseProductCardType[];
}> => {
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
  const { latestProducts } = await getHomePageData(6);

  return (
    <main className="bg-warm-white">
      {/* Hero Section - Full viewport artisan showcase */}
      <Hero />

      {/* Latest Products Section */}
      <section className="relative py-8 bg-gradient-to-b from-warm-white via-cream/20 to-warm-white">
        <Subtitle
          subtitle="Uusimmat tuotteet"
          description="Tuoreimmat lisäykset tuotevalikoimaan - jokainen huolella valittu"
        />

        {/* Desktop grid */}
        <div className="hidden sm:block container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {latestProducts.map((item) => (
              <ProductCard item={item} key={item.id} />
            ))}
          </div>

          {/* View all products link */}
          <div className="flex justify-center mt-16">
            <a
              href="/products"
              className="group inline-flex items-center gap-3 px-8 py-4 border border-charcoal/20 text-charcoal font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:border-rose-gold hover:text-rose-gold"
            >
              <span>Näytä kaikki tuotteet</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile carousel */}
        <ProductCarousel products={latestProducts} />
      </section>
      {/* Categories Section */}
      <section className="relative">
        <Subtitle
          subtitle="Tuotekokoelmat"
          description="Tutustu huolella kuratoituun valikoimaamme"
        />
        <CategorySection />
      </section>

      {/* About Section */}
      <AboutMeSection />

      {/* Final CTA Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-warm-white via-cream/40 to-soft-blush/30 overflow-hidden">
        {/* Decorative border frame */}
        <div className="absolute inset-6 sm:inset-10 border border-rose-gold/15 pointer-events-none" />

        {/* Corner accents */}
        <div className="absolute top-6 left-6 sm:top-10 sm:left-10 w-8 h-8 border-l-2 border-t-2 border-rose-gold/40" />
        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 w-8 h-8 border-r-2 border-t-2 border-rose-gold/40" />
        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 w-8 h-8 border-l-2 border-b-2 border-rose-gold/40" />
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-8 h-8 border-r-2 border-b-2 border-rose-gold/40" />

        {/* Floating diamonds */}
        <div className="absolute top-1/4 left-[15%] w-2 h-2 bg-rose-gold/25 diamond-shape hidden sm:block" />
        <div className="absolute top-1/3 right-[12%] w-3 h-3 bg-champagne/30 diamond-shape hidden sm:block" />
        <div className="absolute bottom-1/3 left-[20%] w-1.5 h-1.5 bg-rose-gold/20 diamond-shape hidden md:block" />

        <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
          {/* Decorative header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-2 h-2 bg-rose-gold/50 diamond-shape" />
            <div className="w-12 h-[1px] bg-gradient-to-r from-rose-gold/50 to-champagne/30" />
            <div className="w-1.5 h-1.5 bg-champagne/40 diamond-shape" />
            <div className="w-12 h-[1px] bg-gradient-to-l from-rose-gold/50 to-champagne/30" />
            <div className="w-2 h-2 bg-rose-gold/50 diamond-shape" />
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-primary font-bold text-charcoal mb-4">
            Löydä sinun tuotteesi
          </h2>

          <p className="text-sm md:text-base text-charcoal/60 font-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
            Laadukas valikoima huolella valittuja tuotteita.
            Olitpa etsimässä lahjaa tai jotain erityistä itsellesi - täältä
            löydät sen.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/products"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-rose-gold"
            >
              Selaa kaikkia tuotteita
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              href="/contact"
              className="group inline-flex items-center gap-3 px-8 py-4 border border-charcoal/30 text-charcoal font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:border-rose-gold hover:text-rose-gold"
            >
              Ota yhteyttä
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
