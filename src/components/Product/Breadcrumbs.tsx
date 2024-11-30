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
  const getCategoryPath = (category: Category): Category[] => {
    const path: Category[] = [category];
    let currentCategory = category;

    while (currentCategory.parentId) {
      const parentCategory = categories.find(
        (c) => c.id === currentCategory.parentId
      );
      if (parentCategory) {
        path.unshift(parentCategory);
        currentCategory = parentCategory;
      } else {
        break;
      }
    }

    return path;
  };

  const findLongestPath = (): Category[] => {
    const paths = categories.map(getCategoryPath);
    return paths.reduce(
      (longest, current) =>
        current.length > longest.length ? current : longest,
      []
    );
  };

  const longestPath = findLongestPath();

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center space-x-2">
        {longestPath.map((category, index) => (
          <li key={category.id} className="flex items-center">
            <Link
              href={`/products/${category.slug}`}
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
