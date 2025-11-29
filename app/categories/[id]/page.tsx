import { notFound } from "next/navigation";
import { getCategoryById, getAvailableProductsByCategoryId, getFiltersWithOptions, getProductFilters } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { ProductFilters } from "@/components/product-filters";

// Mark this page as dynamic since it uses params and searchParams
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const categoryId = parseInt(id, 10);
  const urlParams = await searchParams;

  if (isNaN(categoryId)) {
    notFound();
  }

  const category = getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  // Get all products
  let products = getAvailableProductsByCategoryId(categoryId);

  // Get filters for this category
  const filters = getFiltersWithOptions(categoryId);

  // Apply search filter
  const searchTerm = urlParams.search as string | undefined;
  if (searchTerm) {
    products = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply filter selections
  filters.forEach(filter => {
    const filterParam = urlParams[`filter_${filter.id}`] as string | undefined;
    if (filterParam) {
      const selectedValues = filterParam.split(',');
      products = products.filter(product => {
        const productFilters = getProductFilters(product.id);
        const productFilterValue = productFilters.find(pf => pf.filter_definition_id === filter.id);

        // If product has filter value assigned, use it
        if (productFilterValue) {
          return selectedValues.includes(productFilterValue.filter_value);
        }

        // Fallback: search in product name (case-insensitive)
        // This helps when products don't have filters assigned yet
        return selectedValues.some(value =>
          product.name.toLowerCase().includes(value.toLowerCase())
        );
      });
    }
  });

  // Apply sort
  const sortOrder = urlParams.sort as string | undefined;
  if (sortOrder === "asc") {
    products.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortOrder === "desc") {
    products.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  // Pagination
  const currentPage = parseInt((urlParams.page as string) || '1', 10);
  const itemsPerPage = 12;
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  // Build pagination URL
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (searchTerm) params.set('search', searchTerm);
    if (sortOrder) params.set('sort', sortOrder);
    filters.forEach(filter => {
      const filterParam = urlParams[`filter_${filter.id}`] as string | undefined;
      if (filterParam) params.set(`filter_${filter.id}`, filterParam);
    });
    return `/categories/${categoryId}?${params.toString()}`;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {category.description}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        {filters.length > 0 && (
          <aside className="lg:w-80 flex-shrink-0">
            <ProductFilters filters={filters} categoryId={categoryId} />
          </aside>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {totalProducts === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {searchTerm || Object.keys(urlParams).some(key => key.startsWith('filter_'))
                  ? "Товары не найдены. Попробуйте изменить фильтры."
                  : "В этой категории пока нет товаров."}
              </p>
            </div>
          ) : (
            <>
              {/* Results Count and Pagination Info */}
              <div className="mb-4 flex items-center justify-between text-gray-600 dark:text-gray-400">
                <div>
                  Найдено товаров: <strong>{totalProducts}</strong>
                </div>
                <div className="text-sm">
                  Показано {startIndex + 1}–{Math.min(endIndex, totalProducts)} из {totalProducts}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
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
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
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

              {/* Pagination Navigation */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={buildPageUrl(currentPage - 1)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Назад
                    </Link>
                  )}

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Link
                          key={pageNum}
                          href={buildPageUrl(pageNum)}
                          className={`px-4 py-2 border rounded transition-colors ${
                            currentPage === pageNum
                              ? 'bg-primary text-white border-primary'
                              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>

                  {currentPage < totalPages && (
                    <Link
                      href={buildPageUrl(currentPage + 1)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Вперёд
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // This will be called at build time, but we'll leave it empty
  // since we want dynamic rendering for now
  return [];
}
