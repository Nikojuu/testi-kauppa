import { Metadata } from "next";
import ProductsPage from "./[...slug]/page";

import { OPEN_GRAPH_IMAGE, TWITTER_IMAGE } from "@/lib/utils";
import {
  STORE_NAME,
  STORE_DOMAIN,
  STORE_DESCRIPTION,
  SEO_ENABLED,
} from "@/app/utils/constants";

export const metadata: Metadata = {
  title: `${STORE_NAME} | Kaikki tuotteet`,
  description: `Tutustu ${STORE_NAME} verkkokaupan tuotteisiin. ${STORE_DESCRIPTION}`,
  keywords:
    "verkkokauppa, tuotteet, lahjat, verkko-ostokset, suomalaiset tuotteet, laadukkaat tuotteet",
  authors: [{ name: STORE_NAME }],
  robots: SEO_ENABLED
    ? "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    : "noindex, nofollow",
  alternates: {
    canonical: `${STORE_DOMAIN}/products`,
  },
  openGraph: {
    title: `${STORE_NAME} | Kaikki tuotteet`,
    description: `Tutustu ${STORE_NAME} verkkokaupan tuotteisiin. ${STORE_DESCRIPTION}`,
    url: `${STORE_DOMAIN}/products`,
    images: [
      {
        url: OPEN_GRAPH_IMAGE,
        width: 1200,
        height: 630,
        alt: `${STORE_NAME} - Tuotteet`,
      },
    ],
    locale: "fi_FI",
    type: "website",
    siteName: STORE_NAME,
  },

  twitter: {
    card: "summary_large_image",
    title: `${STORE_NAME} | Kaikki tuotteet`,
    description: `Tutustu ${STORE_NAME} verkkokaupan tuotteisiin ja löydä itsellesi sopiva tuote.`,
    images: [TWITTER_IMAGE],
  },
};

export default ProductsPage;
