import Image, { ImageProps } from "next/image";

type ImageKitProps = Omit<ImageProps, "src"> & {
  src: string; // Your UploadThing URL from the database
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  transformations?: string; // e.g., "w-500,h-500"
};

const ImageKitImage = ({
  src,
  width,
  alt,
  height,
  quality = 90,
  transformations,
  ...props
}: ImageKitProps) => {
  const params = new URLSearchParams();
  if (transformations) params.set("tr", transformations);
  if (quality) params.set("q", quality.toString());

  // Build the ImageKit URL
  const imageKitUrl = `https://ik.imagekit.io/putiikkipalvelu/${src}?${params}`;

  return (
    <Image
      alt={alt}
      src={imageKitUrl}
      width={width}
      height={height}
      {...props}
    />
  );
};

export default ImageKitImage;
