import PhotoGallery from "@/components/Aboutpage/PhotoGallery";
import Subtitle from "@/components/subtitle";
import { Metadata } from "next";
import { getStoreConfig, getSEOValue, SEO_FALLBACKS } from "@/lib/actions/storeConfigActions";
import { SEO_ENABLED } from "@/app/utils/constants";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const config = await getStoreConfig();

    const title = `${config.store.name} | Galleria`;
    const description = `Tutustu ${config.store.name} kuva-galleriaan ja tuotteisiimme.`;
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
        canonical: `${domain}/gallery`,
      },
      openGraph: {
        title,
        description,
        url: `${domain}/gallery`,
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
    console.error("Error generating gallery page metadata:", error);

    return {
      title: "Galleria",
      description: "Kuva-galleria",
      robots: "noindex, nofollow",
    };
  }
}

const GalleryPage = () => {
  return (
    <div className="mt-24 md:mt-48 mx-auto max-w-screen-2xl px-4">
      <Subtitle subtitle="Galleria" />
      <PhotoGallery />
    </div>
  );
};

export default GalleryPage;
