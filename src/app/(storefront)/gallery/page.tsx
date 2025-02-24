import PhotoGallery from "@/components/Aboutpage/PhotoGallery";
import Subtitle from "@/components/subtitle";
import { Metadata } from "next";
import { OPEN_GRAPH_IMAGE, TWITTER_IMAGE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Putiikkipalvelu | Galleria",
  description: "Galleria",
  keywords:
    "Putiikkipalvelu, verkkokauppa, galleria, käsintehty, korut, lahjat, lasihelmet",
  authors: [{ name: "Pupun Korvat" }],
  robots:
    "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",

  openGraph: {
    title: "Putiikkipalvelu | Galleria",
    description: "Putiikkipalvelu on verkkokauppa-alusta",
    url: "https://www.putiikkipalvelu.fi", // Your website URL
    images: [
      {
        url: OPEN_GRAPH_IMAGE, // Main product image
        width: 1200,
        height: 630,
        alt: "Putiikkipalvelu",
      },
    ],
    locale: "fi_FI",
    type: "website",
    siteName: "Putiikkipalvelu",
  },

  twitter: {
    card: "summary_large_image",
    title: "Putiikkipalvelu | Galleria",
    description: "Putiikkipalvelu on verkkokauppa-alusta",
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
