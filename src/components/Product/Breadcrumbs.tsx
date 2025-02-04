import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

interface BreadcrumbsProps {
  categories: Category[];
  productName: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  categories,
  productName,
}) => {
  const getCombinedCategoryPath = (categories: Category[]): Category[] => {
    const categoryMap = new Map(categories.map((c) => [c.id, c]));
    const path: Category[] = [];

    for (const category of categories) {
      const categoryPath: Category[] = [];
      let currentCategory: Category | undefined = category;

      while (currentCategory) {
        categoryPath.unshift(currentCategory);
        currentCategory = currentCategory.parentId
          ? categoryMap.get(currentCategory.parentId)
          : undefined;
      }

      for (const cat of categoryPath) {
        if (!path.some((c) => c.id === cat.id)) {
          path.push(cat);
        }
      }
    }

    return path;
  };

  const combinedPath = getCombinedCategoryPath(categories);

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center space-x-2">
        <li className="flex items-center">
          <Link href="/products" className="text-gray-500 hover:text-gray-700">
            Tuotteet
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
        </li>
        {combinedPath.map((category, index) => (
          <li key={category.id} className="flex items-center">
            <Link
              href={`/products/${combinedPath
                .slice(0, index + 1)
                .map((c) => c.slug)
                .join("/")}`}
              className="text-gray-500 hover:text-gray-700"
            >
              {category.name}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
          </li>
        ))}
        <li className="flex items-center">
          <span className="text-gray-900 font-medium">{productName}</span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
