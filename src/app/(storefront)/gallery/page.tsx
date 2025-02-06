import PhotoGallery from "@/components/Aboutpage/PhotoGallery";
import Subtitle from "@/components/subtitle";
import { Metadata } from "next";
import { OPEN_GRAPH_IMAGE, TWITTER_IMAGE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pupun Korvat | Galleria",
  description:
    "Galleriassa voit tutustua Pupun Korvien käsintehtyihin koruihin ja löytää inspiraatiota seuraavaa koruhankintaasi varten.",
  keywords:
    "korut, käsintehty, lahjat, lasihelmet, muotoilu, verkkokauppa,uniikit korut, käsityö, korvakorut, kaulakorut, rannekorut, lahja, ystävänpäivä, syntymäpäivä, joulu, äitienpäivä, ystävä, nainen, tyttöystävä, vaimo, äiti, tytär, sisko, ystävyys, rakkaus, kauneus, muoti, tyyli, ajaton, laadukas, kestävä, ekologinen, vastuullinen, kotimainen, suomalainen, design, suunnittelu, käsityöläinen,  käsityöläisyys,suomalainen design,käsityöläinen, ",
  authors: [{ name: "Pupun Korvat" }],
  robots:
    "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",

  openGraph: {
    title: "Pupun Korvat | Galleria",
    description:
      "Käsintehtyjä koruja lasihelmistä. Tutustu Pupun Korvien koruvalikoimaan ja löydä itsellesi sopiva koru tai lahja ystävälle.",
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
    title: "Pupun Korvat | Galleria",
    description:
      "Tutustu Pupun Korvien käsintehtyihin koruihin ja löydä ainutlaatuinen lahja tai itsellesi sopiva koru.",
    images: [TWITTER_IMAGE], // Main Twitter image
  },
};

const GalleryPage = () => {
  return (
    <div className="mt-24 md:mt-48 mx-auto max-w-screen-2xl px-4">
      <Subtitle subtitle="Galleria" />
      <PhotoGallery />
    </div>
  );
};

export default GalleryPage;
