"use client";

import Link from "next/link";
import { Trash2, Edit, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface FilterOption {
  id: number;
  filter_definition_id: number;
  option_value: string;
  display_order: number;
  created_at: string;
}

interface Filter {
  id: number;
  category_id: number;
  filter_name: string;
  filter_type: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  options: FilterOption[];
}

interface FilterListProps {
  filters: Filter[];
  categoryId: number;
}

export function FilterList({ filters, categoryId }: FilterListProps) {
  const router = useRouter();

  const handleDeleteFilter = async (filterId: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот фильтр? Все его опции также будут удалены.")) {
      return;
    }

    try {
      const response = await fetch(`/api/filters/${filterId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Не удалось удалить фильтр");
      }
    } catch (error) {
      console.error("Error deleting filter:", error);
      alert("Ошибка при удалении фильтра");
    }
  };

  const handleDeleteOption = async (filterId: number, optionId: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту опцию?")) {
      return;
    }

    try {
      const response = await fetch(`/api/filters/${filterId}/options/${optionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Не удалось удалить опцию");
      }
    } catch (error) {
      console.error("Error deleting option:", error);
      alert("Ошибка при удалении опции");
    }
  };

  const getFilterTypeLabel = (type: string) => {
    switch (type) {
      case "checkbox": return "Множественный выбор";
      case "radio": return "Одиночный выбор";
      case "range": return "Диапазон";
      case "select": return "Выпадающий список";
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {filters.map((filter) => (
        <div
          key={filter.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        >
          {/* Filter Header */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{filter.filter_name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Тип: {getFilterTypeLabel(filter.filter_type)} • Порядок: {filter.display_order}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/categories/${categoryId}/filters/${filter.id}/options/new`}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Опция
                </Link>
                <Link
                  href={`/admin/categories/${categoryId}/filters/${filter.id}/edit`}
                  className="flex items-center gap-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDeleteFilter(filter.id)}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Options */}
          <div className="p-4">
            {filter.options.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Нет опций. Добавьте первую опцию для этого фильтра.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filter.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600"
                  >
                    <span className="font-medium">{option.option_value}</span>
                    <button
                      onClick={() => handleDeleteOption(filter.id, option.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
