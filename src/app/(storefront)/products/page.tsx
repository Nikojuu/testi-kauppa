import { Metadata } from "next";
import ProductsPage from "./[...slug]/page";
import { getStoreConfig, getSEOValue, SEO_FALLBACKS } from "@/lib/actions/storeConfigActions";
import { SEO_ENABLED } from "@/app/utils/constants";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const config = await getStoreConfig();

    const title = `${config.store.name} | Kaikki tuotteet`;
    const description = getSEOValue(
      config.seo.seoDescription,
      `Tutustu ${config.store.name} verkkokaupan tuotteisiin. ${SEO_FALLBACKS.description}`
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
        canonical: `${domain}/products`,
      },
      openGraph: {
        title,
        description,
        url: `${domain}/products`,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${config.store.name} - Tuotteet`,
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
    console.error("Error generating products page metadata:", error);

    return {
      title: "Kaikki tuotteet",
      description: "Tutustu tuotevalikoimaamme.",
      robots: "noindex, nofollow",
    };
  }
}

export default ProductsPage;
