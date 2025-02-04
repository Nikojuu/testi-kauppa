"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type SortOption = {
  label: string;
  value: string;
};

const sortOptions: SortOption[] = [
  { label: "Uusimmat", value: "newest" },
  { label: "Hinta: Alhaisin", value: "price_asc" },
  { label: "Hinta: Korkein", value: "price_desc" },
  { label: "Suosituimmat", value: "popularity" },
];

export function SortOptions() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    params.set("page", "1"); // Reset to first page when sorting changes
    return params.toString();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-4">
      <span className="text-sm font-semibold text-gray-700">Järjestä:</span>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => (
          <Link
            key={option.value}
            href={`${pathname}?${createQueryString("sort", option.value)}`}
            className={`text-sm px-3 py-2 rounded-full ${
              currentSort === option.value
                ? "font-semibold text-primary bg-primary/10"
                : "text-gray-600 hover:text-primary hover:bg-primary/5"
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
