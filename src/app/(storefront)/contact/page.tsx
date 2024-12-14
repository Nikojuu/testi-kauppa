import ContactForm from "@/components/Contactpage/ContactForm";
import { OPEN_GRAPH_IMAGE, TWITTER_IMAGE } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pupun Korvat | Ota yhteyttä",
  description:
    "Ota yhteyttä Pupun Korviin ja kysy lisää käsintehtyjen korujen valmistuksesta tai tilauksesta. Löydä sopiva koru tai tilaa uniikki lahja ystävälle.",
  keywords:
    "korut, käsintehty, lahjat, lasihelmet, muotoilu, verkkokauppa,uniikit korut, käsityö, korvakorut, kaulakorut, rannekorut, lahja, ystävänpäivä, syntymäpäivä, joulu, äitienpäivä, ystävä, nainen, tyttöystävä, vaimo, äiti, tytär, sisko, ystävyys, rakkaus, kauneus, muoti, tyyli, ajaton, laadukas, kestävä,  kotimainen, suomalainen, design, suunnittelu, käsityöläinen,  käsityöläisyys,suomalainen design,käsityöläinen, ",
  authors: [{ name: "Pupun Korvat" }],
  robots:
    "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",

  openGraph: {
    title: "Pupun Korvat | Ota yhteyttä",
    description:
      "Ota yhteyttä Pupun Korviin ja kysy lisää käsintehtyjen korujen valmistuksesta tai tilauksesta. Löydä sopiva koru tai tilaa uniikki lahja ystävälle.",
    url: "https://www.pupunkorvat.fi", // Your website URL
    images: [
      {
        url: OPEN_GRAPH_IMAGE, // Main product image
        width: 1200,
        height: 630,
        alt: "Pupun Korvat - Käsintehty koru",
      },
    ],
    locale: "fi_FI",
    type: "website",
    siteName: "Pupun Korvat",
  },

  twitter: {
    card: "summary_large_image",
    title: "Pupun Korvat | Ota yhteyttä",
    description:
      "Ota yhteyttä Pupun Korviin ja kysy lisää käsintehtyjen korujen valmistuksesta tai tilauksesta. Löydä sopiva koru tai tilaa uniikki lahja ystävälle.",
    images: [TWITTER_IMAGE], // Main Twitter image
  },
};

const ContactRoute = () => {
  return <ContactForm />;
};

export default ContactRoute;
