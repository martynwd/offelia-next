"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Category {
  id: number;
  name: string;
  description: string | null;
}

interface Product {
  id: number;
  name: string;
  price: number | null;
  category_id: number;
}

interface SearchResults {
  categories: Category[];
  products: Product[];
  query: string;
}

interface SearchBarProps {
  isMobile?: boolean;
}

export function SearchBar({ isMobile = false }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setSearchTerm("");
    setResults(null);
    setIsOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const hasResults = results && (results.categories.length > 0 || results.products.length > 0);

  return (
    <div ref={searchRef} className="relative flex-1">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className={`absolute ${isMobile ? 'left-2' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск товаров и категорий..."
            className={`w-full ${isMobile ? 'pl-8 pr-8 py-2' : 'pl-10 pr-10 py-2'} border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          size="sm"
          className="bg-primary hover:bg-primary/90 shrink-0"
          disabled={!searchTerm.trim()}
        >
          Поиск
        </Button>
      </form>

      {/* Dropdown Results */}
      {isOpen && searchTerm.length >= 2 && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Поиск...
            </div>
          ) : hasResults ? (
            <div className="py-2">
              {/* Categories Section */}
              {results.categories.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Категории
                  </div>
                  {results.categories.map((category) => (
                    <Link
                      key={`cat-${category.id}`}
                      href={`/categories/${category.id}`}
                      onClick={() => {
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="font-medium text-sm">{category.name}</div>
                      {category.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {category.description}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              )}

              {/* Products Section */}
              {results.products.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Товары
                  </div>
                  {results.products.map((product) => (
                    <Link
                      key={`prod-${product.id}`}
                      href={`/products/${product.id}`}
                      onClick={() => {
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{product.name}</div>
                        {product.price && (
                          <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 ml-2">
                            {product.price.toFixed(2)}₽
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* View All Results Link */}
              <div className="border-t border-gray-200 dark:border-gray-700 mt-2">
                <Link
                  href={`/search?q=${encodeURIComponent(searchTerm)}`}
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="block px-4 py-3 text-center text-sm font-medium text-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Показать все результаты для &ldquo;{searchTerm}&rdquo;
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Ничего не найдено для &ldquo;{searchTerm}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
