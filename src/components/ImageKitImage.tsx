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
  const BLUR_DATA_URL =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2U1ZTdlYiIvPgo8L3N2Zz4=";
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
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      {...props}
    />
  );
};

export default ImageKitImage;
