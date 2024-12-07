"use client";
import { useState } from "react";

import PhotoAlbum from "react-photo-album";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// import optional lightbox plugins
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

const photos = [
  { src: "/kuva1.jpg", width: 800, height: 600, alt: "kuva1" },
  { src: "/kuva2.jpg", width: 1600, height: 900 },
  { src: "/kuva3.jpg", width: 800, height: 600 },
];

const PhotoGallery = () => {
  const [index, setIndex] = useState(-1);
  return (
    <div className="mx-auto mt-32  mb-12 w-[80vw]">
      <PhotoAlbum
        photos={photos}
        layout="masonry"
        renderPhoto={NextJsImage}
        columns={(containerWidth) => {
          if (containerWidth < 400) return 2;
          if (containerWidth < 800) return 3;
          return 4;
        }}
        targetRowHeight={150}
        onClick={({ index }) => setIndex(index)}
        defaultContainerWidth={1200}
        sizes={{
          size: "calc(100vw - 40px)",
          sizes: [
            { viewport: "(max-width: 299px)", size: "calc(100vw - 10px)" },
            { viewport: "(max-width: 599px)", size: "calc(100vw - 20px)" },
            { viewport: "(max-width: 1199px)", size: "calc(100vw - 30px)" },
          ],
        }}
      />

      <Lightbox
        slides={photos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        // enable optional lightbox plugins
        plugins={[Thumbnails, Zoom]}
      />
    </div>
  );
};

import Image from "next/image";
import type { RenderPhotoProps } from "react-photo-album";

function NextJsImage({
  photo,
  imageProps: { alt, title, sizes, onClick },
  wrapperStyle,
}: RenderPhotoProps) {
  return (
    <div style={{ ...wrapperStyle, position: "relative", overflow: "hidden" }}>
      <Image
        fill
        className="rounded-sm object-cover transition-transform duration-300 hover:scale-105"
        src={photo}
        placeholder={"blurDataURL" in photo ? "blur" : undefined}
        {...{ alt, title, sizes, onClick }}
      />
    </div>
  );
}

export default PhotoGallery;
