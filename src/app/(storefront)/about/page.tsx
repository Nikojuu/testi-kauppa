import AboutBlock from "@/components/Aboutpage/AboutBlock";
import Subtitle from "@/components/subtitle";
import { Metadata } from "next";

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
export const metadata: Metadata = {
  title: "Tietoa minusta | Pupun Korvat",
  description:
    "Opi korujen valmistusprosessistamme ja materiaaleistamme. Tutustu käsintehtyjen korujemme tarinaan.",
  openGraph: {
    title: "Tietoa minusta | Pupun Korvat",
    description:
      "Opi korujen valmistusprosessistamme ja materiaaleistamme. Tutustu käsintehtyjen korujemme tarinaan.",
    images: [
      {
        // muuta kuva
        url: "/kuva1.jpg",
        width: 1200,
        height: 630,
        alt: "Pupun Korvat",
      },
    ],
  },
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
