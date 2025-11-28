import { getAllCategories, getProductsPaginated, getTotalProductsCount } from "@/lib/db";
import { checkAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminPage({ searchParams }: PageProps) {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const itemsPerPage = 50;

  const categories = getAllCategories();
  const products = getProductsPaginated(currentPage, itemsPerPage);
  const totalProducts = getTotalProductsCount();
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <Link
          href="/admin/logout"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
        >
          Logout
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Categories</h2>
            <Link
              href="/admin/categories/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              Add Category
            </Link>
          </div>
          <div className="space-y-3">
            {categories.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No categories yet.
              </p>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {category.description}
                      </p>
                    )}
                    {category.menu_display && (
                      <span className="inline-block mt-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        In Menu
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/categories/${category.id}/delete`}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Delete
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Products Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Products</h2>
            <Link
              href="/admin/products/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              Add Product
            </Link>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {products.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No products yet.
              </p>
            ) : (
              products.map((product) => {
                const category = categories.find(c => c.id === product.category_id);
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Category: {category?.name || 'Unknown'}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          ${product.price ? product.price.toFixed(2) : '0.00'}
                        </span>
                        {product.avialability ? (
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                            Available
                          </span>
                        ) : (
                          <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}/delete`}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Delete
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
            </div>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/admin?page=${currentPage - 1}`}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Previous
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
                      href={`/admin?page=${pageNum}`}
                      className={`px-4 py-2 border rounded transition-colors ${
                        currentPage === pageNum
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>

              {currentPage < totalPages && (
                <Link
                  href={`/admin?page=${currentPage + 1}`}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
