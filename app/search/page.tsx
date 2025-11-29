import { getAllCategories, getAllProducts } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";

  if (!query) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Поиск</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Введите запрос для поиска товаров и категорий
        </p>
      </div>
    );
  }

  const allCategories = getAllCategories();
  const allProducts = getAllProducts();

  const matchedCategories = allCategories.filter(category =>
    category.name.toLowerCase().includes(query.toLowerCase())
  );

  const matchedProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults = matchedCategories.length + matchedProducts.length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Результаты поиска: &ldquo;{query}&rdquo;
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Найдено результатов: <strong>{totalResults}</strong>
        </p>
      </div>

      {totalResults === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            По запросу &ldquo;{query}&rdquo; ничего не найдено
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Попробуйте изменить запрос или просмотрите наш каталог
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Categories Section */}
          {matchedCategories.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Категории ({matchedCategories.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchedCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.id}`}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Products Section */}
          {matchedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Товары ({matchedProducts.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {matchedProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                  >
                    {product.photo_url ? (
                      <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                        <Image
                          src={product.photo_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {product.price ? product.price.toFixed(2) : '0.00'}₽
                        </span>
                        {product.avialability && (
                          <span className="text-green-600 dark:text-green-400 text-sm">
                            В наличии
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
