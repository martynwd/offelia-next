import Link from "next/link";
import { getAllCategories } from "@/lib/db";

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Все категории товаров</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Выберите категорию для просмотра товаров
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Категории пока не добавлены.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-primary"
            >
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
