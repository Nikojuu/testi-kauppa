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
  imgSrc: "/korvakorutesti.jpg",
  title: "Valmistus ja materiaalit",
  text: 'Ah, tervetuloa kurkistamaan korujen taianomaisen maailman kulisseihin! Olen hieman kuin kissa auringonpaisteessa - viihdyn parhaiten kimalluksen ja kauneuden keskellä. Koruni syntyvät kuin kissan kehräys, hellästi ja huolella. Usein minulta kysytään, "Miten ihmeessä nämä pienet taideteokset oikein syntyvät?" No, istahdetaanpa hetkeksi alas, kuin kissa pehmeälle tyynylle, niin kerron teille salaisuuteni.',
  reverse: false,
};
const aboutPageBlock2 = {
  imgSrc: "/rannekorutesti.jpg",
  title: "Näin teen koruni ja mitä materiaaleja käytän",
  text: "Jokainen koru on kuin pieni seikkailu. Aloitan materiaalien valinnalla - ne ovat kuin leluhiiriä kissalle, joilla leikitellään kunnes syntyy jotain täydellistä. Käytän kirkkaita helmiä, kuultavia kiviä ja kimaltelevaa metallia. Ne ovat yhtä houkuttelevia kuin kissan silmät pimeässä. Sitten alkaa varsinainen taikuus. Sormet tanssivat kuin kissan tassut, kun punon, liitän ja muotoilen materiaaleja. Joskus työ sujuu kuin kissan leikki, toisinaan se vaatii kissanpäiviä keskittymistä. Mutta lopputulos on aina yhtä ihastuttava kuin kissan kehräys.",
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
