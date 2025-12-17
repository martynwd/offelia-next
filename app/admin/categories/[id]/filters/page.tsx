import { notFound } from "next/navigation";
import { getCategoryById, getFiltersWithOptions } from "@/lib/db";
import Link from "next/link";
import { FilterList } from "@/components/admin/filter-list";
import { AdminAuthGuard } from "@/components/admin-auth-guard";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CategoryFiltersPage({ params }: PageProps) {
  const { id } = await params;
  const categoryId = parseInt(id, 10);

  if (isNaN(categoryId)) {
    notFound();
  }

  const category = getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  const filters = getFiltersWithOptions(categoryId);

  return (
    <AdminAuthGuard>
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Фильтры для категории: {category.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Управление фильтрами для товаров в этой категории
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/admin/categories/${categoryId}/filters/new`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
          >
            + Добавить фильтр
          </Link>
          <Link
            href="/admin/categories"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
          >
            ← Назад к категориям
          </Link>
        </div>
      </div>

      {filters.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            У этой категории пока нет фильтров
          </p>
          <Link
            href={`/admin/categories/${categoryId}/filters/new`}
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors"
          >
            Создать первый фильтр
          </Link>
        </div>
      ) : (
        <FilterList filters={filters} categoryId={categoryId} />
      )}
    </div>
    </AdminAuthGuard>
  );
}
