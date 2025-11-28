"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Category } from "@/lib/db";

interface MobileNavProps {
  categories: Category[];
  navigationItems: { name: string; href: string }[];
}

export function MobileNav({ categories, navigationItems }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold text-lg">Меню</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-4">
              {/* Catalog with Accordion */}
              <div className="mb-2">
                <button
                  onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-100 rounded-md transition-colors text-left"
                >
                  <span className="font-medium">Каталог</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isCatalogOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Categories List */}
                {isCatalogOpen && (
                  <div className="mt-2 ml-4 space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.id}`}
                        onClick={() => setIsOpen(false)}
                        className="block p-2 hover:bg-gray-100 rounded-md transition-colors text-sm"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Other Navigation Items */}
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block p-3 hover:bg-gray-100 rounded-md transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
