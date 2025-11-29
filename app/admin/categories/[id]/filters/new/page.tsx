import { notFound, redirect } from "next/navigation";
import { getCategoryById, createFilterDefinition } from "@/lib/db";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewFilterPage({ params }: PageProps) {
  const { id } = await params;
  const categoryId = parseInt(id, 10);

  if (isNaN(categoryId)) {
    notFound();
  }

  const category = getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  async function handleSubmit(formData: FormData) {
    "use server";

    const filterName = formData.get("filterName") as string;
    const filterType = formData.get("filterType") as string;
    const displayOrder = parseInt(formData.get("displayOrder") as string, 10) || 0;

    if (!filterName || !filterType) {
      throw new Error("Filter name and type are required");
    }

    createFilterDefinition(categoryId, filterName, filterType, displayOrder);
    redirect(`/admin/categories/${categoryId}/filters`);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">
          Создать фильтр для: {category.name}
        </h1>
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
            <label htmlFor="filterName" className="block text-sm font-medium mb-2">
              Название фильтра *
            </label>
            <input
              type="text"
              id="filterName"
              name="filterName"
              required
              placeholder="Например: Производитель, По диагонали, Цвет"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Это название будет отображаться на странице фильтров
            </p>
          </div>

          <div>
            <label htmlFor="filterType" className="block text-sm font-medium mb-2">
              Тип фильтра *
            </label>
            <select
              id="filterType"
              name="filterType"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
            >
              <option value="checkbox">Множественный выбор (checkbox)</option>
              <option value="radio">Одиночный выбор (radio)</option>
              <option value="range">Диапазон (range)</option>
              <option value="select">Выпадающий список (select)</option>
            </select>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Checkbox - можно выбрать несколько значений (например, бренды)
              <br />
              Radio - можно выбрать только одно значение
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
              Фильтры с меньшим номером отображаются первыми
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors"
            >
              Создать фильтр
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
