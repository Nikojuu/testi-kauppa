import AboutBlock from "@/components/Aboutpage/AboutBlock";
import { Metadata } from "next";
import { OPEN_GRAPH_IMAGE, TWITTER_IMAGE } from "@/lib/utils";
import { AboutHero } from "@/components/Aboutpage/AboutHero";
import { AboutCTA } from "@/components/Aboutpage/AboutCTA";

export const metadata: Metadata = {
  title: "Putiikkipalvelu | Tietoa meistä",
  description: "Tutustu Putiikkipalvelun tarinaan. ",
  keywords:
    "Putiikkipalvelu, verkkokauppa, käsityö, korut, korujen valmistus, materiaalit, käsintehty, uniikki, lahjaidea",
  authors: [{ name: "Pupun Korvat" }],
  robots:
    "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",

  openGraph: {
    title: "Pupun Korvat | Tietoa Minusta",
    description:
      "Tutustu Pupun Korvien korujen valmistuksen tarinaan ja ainutlaatuiseen muotoiluun. Lue lisää käsityöläisyydestä ja inspiraatiosta tuotteidemme takana.",
    url: "https://www.pupunkorvat.fi/about", // Your website URL
    images: [
      {
        url: OPEN_GRAPH_IMAGE, // Main product image
        width: 1200,
        height: 630,
        alt: "Pupun Korvat - Käsintehty koru",
      },
    ],
    locale: "fi_FI",
    type: "profile",
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
