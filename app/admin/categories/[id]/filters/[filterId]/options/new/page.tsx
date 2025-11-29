import { notFound, redirect } from "next/navigation";
import { getCategoryById, getFiltersByCategory, createFilterOption } from "@/lib/db";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
    filterId: string;
  }>;
}

export default async function NewFilterOptionPage({ params }: PageProps) {
  const { id, filterId } = await params;
  const categoryId = parseInt(id, 10);
  const filterDefinitionId = parseInt(filterId, 10);

  if (isNaN(categoryId) || isNaN(filterDefinitionId)) {
    notFound();
  }

  const category = getCategoryById(categoryId);
  const filters = getFiltersByCategory(categoryId);
  const filter = filters.find(f => f.id === filterDefinitionId);

  if (!category || !filter) {
    notFound();
  }

  async function handleSubmit(formData: FormData) {
    "use server";

    const optionValue = formData.get("optionValue") as string;
    const displayOrder = parseInt(formData.get("displayOrder") as string, 10) || 0;

    if (!optionValue) {
      throw new Error("Option value is required");
    }

    createFilterOption(filterDefinitionId, optionValue, displayOrder);
    redirect(`/admin/categories/${categoryId}/filters`);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Добавить опцию
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Категория: {category.name} • Фильтр: {filter.filter_name}
          </p>
        </div>
        <Link
          href={`/admin/categories/${categoryId}/filters`}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
        >
          ← Назад к фильтрам
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl">
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="optionValue" className="block text-sm font-medium mb-2">
              Значение опции *
            </label>
            <input
              type="text"
              id="optionValue"
              name="optionValue"
              required
              placeholder="Например: Samsung, 32, Красный"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Это значение будет отображаться в фильтре
            </p>
          </div>

          <div>
            <label htmlFor="displayOrder" className="block text-sm font-medium mb-2">
              Порядок отображения
            </label>
            <input
              type="number"
              id="displayOrder"
              name="displayOrder"
              defaultValue={0}
              min={0}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Опции с меньшим номером отображаются первыми
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors"
            >
              Добавить опцию
            </button>
            <Link
              href={`/admin/categories/${categoryId}/filters`}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded transition-colors"
            >
              Отмена
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
