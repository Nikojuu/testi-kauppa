import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowBigLeft, ArrowRight } from "lucide-react";

const AboutMeSection = () => {
  return (
    <section className=" mx-auto mb-32 flex w-full mt-32 container max-w-screen-2xl flex-col sm:px-4 lg:flex-row">
      <div className="relative aspect-square w-full lg:w-1/2 h-96 lg:h-auto">
        <Image fill alt="" src="/kuva1.jpg" className="object-cover h-auto" />
      </div>

      <div className="z-10 mx-1 -mt-32 flex-1 bg-pink-50 p-2 text-black sm:mx-8 sm:p-8 lg:-ml-24  lg:mb-24 lg:mt-24">
        <h3 className="mb-8  font-primary  text-5xl ">
          Huolellinen suunnittelu{" "}
        </h3>
        <p>
          Jokainen tuotteeni lähtee liikkeelle huolellisesta
          suunnitteluprosessista. Luon korkealaatuisia ja ainutlaatuisia
          tuotteita, jotka erottuvat joukosta. Suunnittelutyössäni yhdistyvät
          käsityötaidot, luovuus ja huolellinen harkinta. Haluan varmistaa, että
          jokainen yksityiskohta on harkittu ja että koruni täyttävät
          korkeimmatkin odotukset niin ulkonäön kuin käytettävyyden suhteen.
        </p>

        <Link href="/about">
          <Button variant="gooeyLeft" className=" mt-4">
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
