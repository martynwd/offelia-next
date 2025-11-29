"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

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

interface ProductFiltersProps {
  filters: Filter[];
  categoryId: number;
}

export function ProductFilters({ filters, categoryId }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sort") || "");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  // Initialize selected filters from URL
  useEffect(() => {
    const initialFilters: Record<string, string[]> = {};
    filters.forEach(filter => {
      const filterValues = searchParams.get(`filter_${filter.id}`);
      if (filterValues) {
        initialFilters[filter.id.toString()] = filterValues.split(',');
      }
    });
    setSelectedFilters(initialFilters);
  }, [searchParams, filters]);

  const handleFilterChange = (filterId: number, value: string, isChecked: boolean) => {
    setSelectedFilters(prev => {
      const filterKey = filterId.toString();
      const currentValues = prev[filterKey] || [];

      if (isChecked) {
        return { ...prev, [filterKey]: [...currentValues, value] };
      } else {
        return { ...prev, [filterKey]: currentValues.filter(v => v !== value) };
      }
    });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    // Add search term
    if (searchTerm) {
      params.set("search", searchTerm);
    }

    // Add sort order
    if (sortOrder) {
      params.set("sort", sortOrder);
    }

    // Add filters
    Object.entries(selectedFilters).forEach(([filterId, values]) => {
      if (values.length > 0) {
        params.set(`filter_${filterId}`, values.join(','));
      }
    });

    router.push(`/categories/${categoryId}?${params.toString()}`);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSortOrder("");
    setSelectedFilters({});
    router.push(`/categories/${categoryId}`);
  };

  const hasActiveFilters = searchTerm || sortOrder || Object.keys(selectedFilters).length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden sticky top-4 max-h-[calc(100vh-2rem)]">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold">Фильтры</h2>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto max-h-[calc(100vh-12rem)] p-3">
        {/* Search */}
        <div className="mb-3">
        <label className="block text-xs font-medium mb-1.5">
          Поиск по названию
        </label>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Введите название..."
            className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                applyFilters();
              }
            }}
          />
        </div>
      </div>

      {/* Price Sort */}
      <div className="mb-3">
        <label className="block text-xs font-medium mb-1.5">
          По цене
        </label>
        <div className="flex gap-1.5">
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "" : "asc")}
            className={`flex-1 px-2 py-1.5 text-xs rounded border transition-colors ${
              sortOrder === "asc"
                ? "bg-primary text-white border-primary"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            По возрастанию
          </button>
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "" : "desc")}
            className={`flex-1 px-2 py-1.5 text-xs rounded border transition-colors ${
              sortOrder === "desc"
                ? "bg-primary text-white border-primary"
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            По убыванию
          </button>
        </div>
      </div>

      {/* Dynamic Filters */}
      {filters.map((filter) => (
        <div key={filter.id} className="mb-3">
          <label className="block text-xs font-medium mb-1.5">
            {filter.filter_name}:
          </label>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {filter.options.map((option) => {
              const isChecked = (selectedFilters[filter.id.toString()] || []).includes(option.option_value);

              return (
                <label
                  key={option.id}
                  className="flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleFilterChange(filter.id, option.option_value, e.target.checked)}
                    className="w-3.5 h-3.5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className={`text-sm ${isChecked ? "text-primary font-medium" : ""}`}>
                    {option.option_value}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex gap-2">
          <button
            onClick={applyFilters}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 text-sm rounded font-medium transition-colors"
          >
            Применить
          </button>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 text-sm rounded font-medium transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Сбросить
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
