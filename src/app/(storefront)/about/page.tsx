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
  title: "Pupunkorvien tarina",
  text: "Pupunkorvien takaa kurkistan minä, Henna. Olen harrastanut taiteilua sekä käsitöitä läpi elämäni ja rakastan kokeilla eri tekniikoita. Minulle tärkeintä käsillä tekemisessä on kyky luoda jotain uniikkia, joka vastaa omaa visiotani. Löydän inspiraatiota mistä vain, mutta rakkaimmat aiheeni löydän luonnosta ja antiikin maailmasta. \n\n Korujen suunnittelu lähtee ajatuksesta, ja mieleni työpöydällä onkin jatkuvasti uusia luonnoksia auki. Luovuudenpuuskissani olen malttamaton ja helmiä on päästävä hypistelemään pikimiten. Lähestyn korujani käsillä tekemisen kautta, en niinkään paperille suunnitellen, ja jokaisen työni takaa löytyykin useita yrityksiä ja virheistä oppimista. \n\n Tehdessäni koruja tärkeintä minulle on käsitöiden hauskuus, enkä koskaan aloita projektia josta en nauttisi, sillä uskon rakkauteni lajiin näkyvän lopputuloksessa.Työtä tehdessäni en taistele aikaa vastaan, vaan haluan luoda tuotteita, jollaisia itse ostaisin, ja joita voin myydä ylpeydellä.",
  reverse: false,
};
const aboutPageBlock2 = {
  imgSrc: "/rannekorutesti.jpg",
  title: "Valmistuksesta ja materiaaleista",
  text: "Jokainen koruni on omaa käsialaani, suunnittelusta toteutukseen. Korut tehdään monen kokoisista yksittäisistä helmistä ja kivi- sekä lasielementeistä. Korut saavat muodon, kun yhdistän helmet toisiinsa ohutta siimaa ja neulaa käyttäen. \n\n Valitsen helmien ja elementtien, kuten kapussien, materiaaliksi useimmiten lasin sen kestävyyden, monipuolisuuden ja valon hohtavuuden takia. Töissäni ei ole käytetty aitoja korukiviä, ellei toisin mainita.Koruissani käytetyt siemenhelmet ovat laadukkaita japanilaisvalmisteisia Miyukin lasihelmiä. Siemenhelmet ovat pintavärjättyä lasia, joissa on suojaava pintakerros väriä suojaamassa. Pinnoitteesta huolimatta helmet voivat menettää värinsä esimerkiksi kovan hikoilun seurauksena, eikä käyttöesineen kanssa kulumaa voi välttää. \n\n Käytän koruissani helmitöihin tarkoitettua vahvaa siimaa, joka on tarkoitettu kestämään käyttöä. Korujen rajua käsittelyä tulee silti välttää, sillä esimerkiksi kaulakorun voimakas vetäminen voi vahingoittaa sitä ja siiman katketessa iso osa korua purkaantuu. \n\n Metalliosat, kuten ketjut, lukot ja koukut, valitsen nikkelittöminä aina kun mahdollista. Mahdollinen nikkelittömyys mainitaan aina korun tiedoissa.",
  reverse: true,
};

const aboutPageBlock3 = {
  imgSrc: "/korvakorutesti.jpg",
  title: "Korujen ylläpito",
  text: "Koruni on tarkoitettu käytettäväksi, eikä kulumilta voida välttyä. Korujen käyttöikää voidaan kuitenkin pidentää pitämällä niistä huolta seuraavilla vinkeillä: \n\n -Älä kisko koruja ja varo niiden jäämistä kiinni esimerkiksi neuleiden silmukoihin riisuttaessa.\n -Ota korut pois ennen uimista ja suihkua, sillä vesi ja varsinkin pesuaineet voivat kuluttaa helmien väripintaa. Puhdistuksen voi tarvittaessa tehdä kostealla paperilla tai vanupuikolla, vältä saippuaa. Voit myös käyttää hopean kiillotukseen tarkoitettua liinaa. \n  -Runsas hikoilu voi kuluttaa korujen pintaa, joten riisu ne urheilun ajaksi.",
  reverse: false,
};

const AboutPage = () => {
  return (
    <section className="mt-48">
      <Subtitle subtitle="Vähän minusta" />
      <div className="mt-32"></div>
      <AboutBlock blockInfo={aboutPageBlock1} />
      <AboutBlock blockInfo={aboutPageBlock2} />
      <AboutBlock blockInfo={aboutPageBlock3} />
    </section>
  );
};

export default AboutPage;
