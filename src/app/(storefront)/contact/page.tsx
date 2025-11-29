import ContactForm from "@/components/Contactpage/ContactForm";
import { Metadata } from "next";
import { getStoreConfig, getSEOValue, SEO_FALLBACKS } from "@/lib/actions/storeConfigActions";
import { SEO_ENABLED } from "@/app/utils/constants";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const config = await getStoreConfig();

    const title = `${config.store.name} | Ota yhteyttä`;
    const description = `Ota yhteyttä ${config.store.name} ja kysy lisää tuotteista tai tilauksesta.`;
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
        canonical: `${domain}/contact`,
      },
      openGraph: {
        title,
        description,
        url: `${domain}/contact`,
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
    console.error("Error generating contact page metadata:", error);

    return {
      title: "Ota yhteyttä",
      description: "Ota yhteyttä ja kysy lisää.",
      robots: "noindex, nofollow",
    };
  }
}

const ContactRoute = () => {
  return <ContactForm />;
};

export default ContactRoute;
