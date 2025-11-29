import AboutBlock from "@/components/Aboutpage/AboutBlock";
import { Metadata } from "next";
import { AboutHero } from "@/components/Aboutpage/AboutHero";
import { AboutCTA } from "@/components/Aboutpage/AboutCTA";
import { getStoreConfig, getSEOValue, SEO_FALLBACKS } from "@/lib/actions/storeConfigActions";
import { SEO_ENABLED } from "@/app/utils/constants";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const config = await getStoreConfig();

    const title = `${config.store.name} | Tietoa meistä`;
    const description = `Tutustu ${config.store.name} tarinaan ja tiimiin.`;
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
        canonical: `${domain}/about`,
      },
      openGraph: {
        title,
        description,
        url: `${domain}/about`,
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
    console.error("Error generating about page metadata:", error);

    return {
      title: "Tietoa meistä",
      description: "Tutustu yrityksemme tarinaan.",
      robots: "noindex, nofollow",
    };
  }
}

const aboutPageBlock1 = {
  imgSrc: "/logo.svg",
  title: "Putiikkipalvelu",
  text: "Putiikkipalvelu tarjoaa verkkokauppapalveluita helposti ja vaivatta \n\n Verkkokaupan suunnittelusta toteutukseen\n\n ",
  reverse: false,
};
const aboutPageBlock2 = {
  imgSrc: "logo.svg",
  title: "Maksupalvelut",
  text: "Käytämme vain luotettavia maksun välittäjiä tällä hetkellä toimii paytrail ja stripe \n\n  ",
  reverse: true,
};

const aboutPageBlock3 = {
  imgSrc: "logo.svg",
  title: "Ammattitaitoinen tyyli",
  text: "Kauppa toteutetaan aina asiakkaan toiveiden mukaan tuoden oman näkemyksemme esille jos tarvetta  ",
  reverse: false,
};

const AboutPage = () => {
  return (
    <main className="bg-warm-white">
      {/* Hero Section */}
      <AboutHero />

      {/* Content Sections */}
      <section className="py-12 md:py-16">
        <AboutBlock blockInfo={aboutPageBlock1} />
        <AboutBlock blockInfo={aboutPageBlock2} />
        <AboutBlock blockInfo={aboutPageBlock3} />
      </section>

      {/* CTA Section */}
      <AboutCTA />
    </main>
  );
};

export default AboutPage;
