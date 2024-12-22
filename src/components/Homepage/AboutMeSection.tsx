import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowBigLeft, ArrowRight } from "lucide-react";

const AboutMeSection = () => {
  return (
    <section className=" mx-auto mb-32 flex w-full max-w-screen-2xl  flex-col px-4 lg:flex-row">
      <div className="relative aspect-square  lg:w-1/2">
        <Image fill alt="" src="/kuva1.jpg" className="object-cover" />
      </div>

      <div className="z-10 mx-1 -mt-32 flex-1 bg-primary p-2 text-black sm:mx-8  sm:p-8 lg:-ml-24  lg:mb-24 lg:mt-24">
        <h3 className="mb-8  font-primary  text-5xl ">Minä olen kultainen</h3>
        <p>
          Muista tämän alle kuva parallax jonka sisällä 2 osainen esittely
          korviksista ja kaulakoruista Lorem ipsum dolor, sit amet consectetur
          adipisicing elit. Aut quae repellat tilaustyö ja yhteydenotto,
          valmistus ja materiaalit Kiinnostuitko tilaustyöstä? Mikäli heräsi
          kysyttävää tai olet kiinnostunut tilaustyöstä, olethan yhteydessä.
          Seuraamalla Mittumaari Design somekanavia Facebookissa ja
          Instagramissa, pysyt ajantasalla tarjouksistamme sekä uutisista.
        </p>

        <p className="my-8">
          Erillinen sivu kuinka korut valmistetaan ja mitä materiaaleja
          käytetään Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          Aut quae repellat aliquid iusto doloribus fuga dolore, id,
          voluptatibus pariatur ipsam reiciendis ut eius a sequi necessitatibus,
          dignissimos perspiciatis beatae harum.
        </p>
        <p className="my-8">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut quae
          repellat aliquid iusto doloribus fuga dolore, id, voluptatibus
          pariatur ipsam reiciendis ut eius a sequi necessitatibus, dignissimos
          perspiciatis beatae harum.
        </p>
        <Link href="/about">
          <Button variant="gooeyLeft" className="bg-violet-400">
            Lue lisää minusta{" "}
            <span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </span>
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default AboutMeSection;
