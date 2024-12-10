import PhotoGallery from "@/components/Aboutpage/PhotoGallery";
import Subtitle from "@/components/subtitle";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Galleria | Pupun Korvat",
  description: "Galleria katso korujamme ja muita tuotteita. ",
  openGraph: {
    title: "Galleria | Pupun Korvat",
    description: "Galleria katso korujamme ja muita tuotteita. ",
    type: "website",
    images: [
      {
        url: "/kuva1.jpg",
        width: 1200,
        height: 630,
        alt: "Galleria - Pupun Korvat",
      },
    ],
  },
};

const GalleryPage = () => {
  return (
    <div className="mt-48">
      <Subtitle subtitle="Galleria" />
      <PhotoGallery />
    </div>
  );
};

export default GalleryPage;
