import ContactForm from "@/components/Contactpage/ContactForm";
import { OPEN_GRAPH_IMAGE, TWITTER_IMAGE } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Putiikkipalvelu | Ota yhteyttä",
  description:
    "Ota yhteyttä Putiikki ja kysy lisää verkkokauppa-alustasta tai tilauksesta. ",
  keywords: "Putiikkipalvelu, verkkokauppa, kauppa  ",
  authors: [{ name: "Putiikkipalvelu" }],
  robots:
    "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",

  openGraph: {
    title: "Pupun Putiikkipalvelu | Ota yhteyttä",
    description:
      "Ota yhteyttä Pupun Korviin ja kysy lisää käsintehtyjen korujen valmistuksesta tai tilauksesta. Löydä sopiva koru tai tilaa uniikki lahja ystävälle.",
    url: "https://www.putiikkipalvelu.fi", // Your website URL
    images: [
      {
        url: OPEN_GRAPH_IMAGE, // Main product image
        width: 1200,
        height: 630,
        alt: "Putiikkipalvelu - Verkkokauppa-alusta",
      },
    ],
    locale: "fi_FI",
    type: "website",
    siteName: "Putiikkipalvelu",
  },

  twitter: {
    card: "summary_large_image",
    title: "Putiikkipalvelu | Ota yhteyttä",
    description:
      "Ota yhteyttä Pupun Korviin ja kysy lisää käsintehtyjen korujen valmistuksesta tai tilauksesta. Löydä sopiva koru tai tilaa uniikki lahja ystävälle.",
    images: [TWITTER_IMAGE], // Main Twitter image
  },
};

const ContactRoute = () => {
  return <ContactForm />;
};

export default ContactRoute;
