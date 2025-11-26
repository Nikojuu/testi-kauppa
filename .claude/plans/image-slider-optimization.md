# Image Slider Optimization with Preloading and Loading Indicators

This guide explains how to optimize an image slider/gallery component with:
- Loading spinner for main image
- Preloading all images on mount
- Smooth fade-in transitions
- Smart loading state management

## Prerequisites

- React component with image slider functionality
- An image CDN that supports URL-based transformations (ImageKit, Cloudinary, etc.)
- Tailwind CSS (or adapt styles accordingly)
- lucide-react for icons (or use your own spinner)

## Step-by-Step Implementation

### 1. Add Required Imports

```tsx
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react"; // Or your preferred spinner
import { cn } from "@/lib/utils"; // Tailwind merge utility
```

### 2. Create URL Builder Helper

Create a helper function to build your CDN image URLs. This is used for preloading.

```tsx
// Helper to build ImageKit URL (adapt for your CDN)
function getImageKitUrl(src: string, transformations: string) {
  const params = new URLSearchParams();
  params.set("tr", transformations);
  return `https://ik.imagekit.io/YOUR_ID/${src}?${params}`;
}
```

### 3. Add State Variables

Add these state variables to your component:

```tsx
const [mainImageIndex, setMainImageIndex] = useState(0);
const [isLoading, setIsLoading] = useState(true);
const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
```

- `isLoading`: Controls spinner visibility for current image
- `loadedImages`: Tracks which images have been loaded (by index)

### 4. Add Preload Effect

This effect preloads ALL images when the component mounts:

```tsx
// Preload all images on mount
useEffect(() => {
  images.forEach((image, index) => {
    const img = new window.Image();
    img.src = getImageKitUrl(image, "w-1200,h-1200,f-auto,q-90"); // Use same transformations as display
    img.onload = () => {
      setLoadedImages((prev) => new Set(prev).add(index));
    };
  });
}, [images]);
```

**Important**: Use the SAME transformations here as you use for displaying the main image. This ensures the browser cache is utilized.

### 5. Add Loading State Effect

This effect updates the loading state when switching images:

```tsx
// Set loading state when switching images
useEffect(() => {
  if (!loadedImages.has(mainImageIndex)) {
    setIsLoading(true);
  } else {
    setIsLoading(false);
  }
}, [mainImageIndex, loadedImages]);
```

### 6. Add Image Load Handler

This function is called when the displayed image finishes loading:

```tsx
function handleImageLoad() {
  setIsLoading(false);
  setLoadedImages((prev) => new Set(prev).add(mainImageIndex));
}
```

### 7. Update Image Component

Add the `onLoad` handler and conditional opacity classes:

```tsx
<Image
  src={images[mainImageIndex]}
  alt="Product image"
  fill
  sizes="(max-width: 768px) 100vw, 600px"
  className={cn(
    "object-cover transition-opacity duration-300",
    isLoading ? "opacity-0" : "opacity-100"
  )}
  onLoad={handleImageLoad}
  priority // For first image
/>
```

### 8. Add Loading Indicator

Add the spinner inside the image container (same parent as the image):

```tsx
{/* Loading Indicator */}
{isLoading && (
  <div className="absolute inset-0 flex items-center justify-center z-20">
    <Loader2 className="w-8 h-8 text-rose-gold animate-spin" />
  </div>
)}
```

**Note**: Adjust the color class (`text-rose-gold`) to match your theme.

## Complete Example

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

function getImageKitUrl(src: string, transformations: string) {
  const params = new URLSearchParams();
  params.set("tr", transformations);
  return `https://ik.imagekit.io/YOUR_ID/${src}?${params}`;
}

export function ImageSlider({ images }: { images: string[] }) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Preload all images on mount
  useEffect(() => {
    images.forEach((image, index) => {
      const img = new window.Image();
      img.src = getImageKitUrl(image, "w-1200,h-1200,f-auto,q-90");
      img.onload = () => {
        setLoadedImages((prev) => new Set(prev).add(index));
      };
    });
  }, [images]);

  // Set loading state when switching images
  useEffect(() => {
    if (!loadedImages.has(mainImageIndex)) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [mainImageIndex, loadedImages]);

  function handleImageLoad() {
    setIsLoading(false);
    setLoadedImages((prev) => new Set(prev).add(mainImageIndex));
  }

  function handlePreviousClick() {
    setMainImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function handleNextClick() {
    setMainImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="grid gap-4">
      {/* Main Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <Image
          src={getImageKitUrl(images[mainImageIndex], "w-1200,h-1200,f-auto,q-90")}
          alt="Product image"
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className={cn(
            "object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={handleImageLoad}
          priority
        />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button onClick={handlePreviousClick} variant="ghost" size="icon">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button onClick={handleNextClick} variant="ghost" size="icon">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative aspect-square cursor-pointer",
              index === mainImageIndex ? "ring-2 ring-primary" : ""
            )}
            onClick={() => setMainImageIndex(index)}
          >
            <Image
              src={getImageKitUrl(image, "w-200,h-200,f-auto,q-80")}
              alt="Thumbnail"
              fill
              sizes="100px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## ImageKit Transformation Reference

For high-quality jewelry/product images, recommended settings:

| Image Type | Transformations | Notes |
|------------|-----------------|-------|
| Main Image | `w-1200,h-1200,f-auto,q-90` | 2x resolution for Retina displays |
| Zoom Image | `w-1800,h-1800,f-auto,q-95` | Higher res for zoom feature |
| Thumbnails | `w-240,h-240,f-auto,q-85` | 2x of display size |
| Mobile Main | `w-1200,h-1200,f-auto,q-95` | Higher quality for mobile |

**Transformation parameters:**
- `w-X,h-X` - Width and height
- `f-auto` - Auto format (WebP when supported)
- `q-XX` - Quality (1-100)

## Key Points

1. **Match preload transformations** - The preload URL must match the display URL exactly for browser caching to work

2. **Use Set for loaded images** - More efficient than array for checking if an image is loaded

3. **Handle both effects** - The preload effect AND the onLoad handler both update loadedImages for reliability

4. **z-index for spinner** - Ensure the spinner appears above the image container

5. **Smooth transition** - The `transition-opacity duration-300` creates a nice fade-in effect

## Adapting for Other CDNs

### Cloudinary
```tsx
function getCloudinaryUrl(src: string, transformations: string) {
  return `https://res.cloudinary.com/YOUR_CLOUD/image/upload/${transformations}/${src}`;
}
// Usage: "w_1200,h_1200,f_auto,q_90"
```

### Imgix
```tsx
function getImgixUrl(src: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  return `https://YOUR_DOMAIN.imgix.net/${src}?${searchParams}`;
}
// Usage: { w: "1200", h: "1200", auto: "format", q: "90" }
```
