import { LoadingProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingFile() {
  return (
    <div className="mt-24 md:mt-48 container mx-auto px-4">
      <Skeleton className="h-10 w-56 my-5" />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <LoadingProductCard />
        <LoadingProductCard />
        <LoadingProductCard />
        <LoadingProductCard />
        <LoadingProductCard />
        <LoadingProductCard />
        <LoadingProductCard />
        <LoadingProductCard />
        <LoadingProductCard />
        <LoadingProductCard />
      </div>
    </div>
  );
}
