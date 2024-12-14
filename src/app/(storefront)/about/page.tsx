import AboutBlock from "@/components/Aboutpage/AboutBlock";
import Subtitle from "@/components/subtitle";
import { Metadata } from "next";

import { OPEN_GRAPH_IMAGE, TWITTER_IMAGE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pupun Korvat | Tietoa minusta",
  description:
    "Tutustu Pupun Korvien käsintehtyihin korujen valmistusmaailmaan ja materiaaleihin. Lue lisää käsityöstä ja korujen valmistusprosessista.",
  keywords:
    "korut, käsintehty, lahjat, lasihelmet, muotoilu, verkkokauppa,uniikit korut, käsityö, korvakorut, kaulakorut, rannekorut, lahja, ystävänpäivä, syntymäpäivä, joulu, äitienpäivä, ystävä, nainen, tyttöystävä, vaimo, äiti, tytär, sisko, ystävyys, rakkaus, kauneus, muoti, tyyli, ajaton, laadukas, kestävä, ekologinen, vastuullinen, kotimainen, suomalainen, design, suunnittelu, käsityöläinen,  käsityöläisyys,suomalainen design,käsityöläinen",
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
  imgSrc: "/kuva1.jpg",
  title: "Valmistus ja materiaalit",
  text: 'Minulta usein kysytään "Miten teen koruni" Noh minäpä näytän valmistusprosessin alempana ja samalla kerron hieman itsestäni, Olen kyllä hiukan maukuva miuku ja mutisen mutta kuultainen kuitenkin ja minä tykkään kuultaisesta ja kirkkaasta ja kimaltavasta ja kauniista ja kaikista kauniista asioista ja minä tykkään myös kissoista',
  reverse: false,
};
const aboutPageBlock2 = {
  imgSrc: "/kuva2.jpg",
  title: "Näin teen koruni ja materia",
  text: 'Minulta usein kysytään "Miten teen koruni" Noh minäpä näytän valmistusprosessin alempana ja samalla kerron hieman itsestäni Minulta usein kysytään "Miten teen koruni" Noh minäpä näytän valmistusprosessin alempana ja samalla kerron hieman itsestäni \n miukumauku Minulta usein kysytään "Miten teen koruni" Noh minäpä näytän valmistusprosessin alempana ja samalla kerron hieman itsestäni',
  reverse: true,
};

const AboutPage = () => {
  return (
    <section className="mt-48">
      <Subtitle subtitle="Vähän minusta" />
      <div className="mt-32"></div>
      <AboutBlock blockInfo={aboutPageBlock1} />
      <AboutBlock blockInfo={aboutPageBlock2} />
    </section>
  );
};

export default AboutPage;
