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
  {
    src: "https://picsum.photos/id/10/800/600",
    width: 800,
    height: 600,
    alt: "kuva1",
  },
  {
    src: "https://picsum.photos/id/200/1600/900",
    width: 1600,
    height: 900,
  },
  {
    src: "https://picsum.photos/id/30/800/600",
    width: 800,
    height: 600,
  },
  {
    src: "https://picsum.photos/id/40/800/600",
    width: 800,
    height: 600,
    alt: "kuva1",
  },
  {
    src: "https://picsum.photos/id/50/1600/900",
    width: 1600,
    height: 900,
  },
  {
    src: "https://picsum.photos/id/60/800/600",
    width: 800,
    height: 600,
  },
  {
    src: "https://picsum.photos/id/70/800/600",
    width: 800,
    height: 600,
    alt: "kuva1",
  },
  {
    src: "https://picsum.photos/id/80/1600/900",
    width: 1600,
    height: 900,
  },
  {
    src: "https://picsum.photos/id/90/800/600",
    width: 800,
    height: 600,
  },
  {
    src: "https://picsum.photos/id/100/800/600",
    width: 800,
    height: 600,
    alt: "kuva1",
  },
  {
    src: "https://picsum.photos/id/110/1600/900",
    width: 1600,
    height: 900,
  },
  {
    src: "https://picsum.photos/id/120/800/600",
    width: 800,
    height: 600,
  },
  {
    src: "https://picsum.photos/id/130/800/600",
    width: 800,
    height: 600,
    alt: "kuva1",
  },
  {
    src: "https://picsum.photos/id/140/1600/900",
    width: 1600,
    height: 900,
  },
  {
    src: "https://picsum.photos/id/151/800/600",
    width: 800,
    height: 600,
  },
  {
    src: "https://picsum.photos/id/160/800/600",
    width: 800,
    height: 600,
    alt: "kuva1",
  },
  {
    src: "https://picsum.photos/id/170/1600/900",
    width: 1600,
    height: 900,
  },
  {
    src: "https://picsum.photos/id/300/800/600",
    width: 800,
    height: 600,
  },
];

const PhotoGallery = () => {
  const [index, setIndex] = useState(-1);
  return (
    <div className="mx-auto   mb-12 ">
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
