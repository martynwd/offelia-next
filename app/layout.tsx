import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { MapPin } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/lib/db";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  title: "Офелия - Теле-аудио-бытовая техника",
  description: "Магазин бытовой техники в Саранске",
};

const navigationItems = [
  { name: "Каталог", href: "/", hasDropdown: true },
  { name: "Магазины", href: "/stores" },
  { name: "Сервис", href: "/service" },
  { name: "Кредит", href: "/credit" },
  { name: "Доставка", href: "/delivery" },
  { name: "Обратная связь", href: "/feedback" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = getAllCategories();

  return (
    <html lang="ru">
      <body className="min-h-screen bg-background">
        <header className="border-b-2 border-gray-200">
          <div className="container mx-auto px-4">
            {/* Top bar */}
            <div className="flex items-center justify-between py-3">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-primary">
                        <MapPin className="h-5 w-5" />
                        <span className="font-medium text-sm lg:text-base">Саранск</span>
                    </div>
                    <Link href="/" className="flex flex-col items-center hover:opacity-80 transition-opacity">
                        <img src="/img.png" alt="Офелия" className="h-10 lg:h-14" />
                    </Link>
                </div>

              {/* Right: Phone, Search, and Mobile Menu */}
              <div className="flex items-center gap-2 lg:gap-4">
                {/* Phone - Hidden on mobile */}
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium">Наши Телефоны:</p>
                  <p className="text-sm text-muted-foreground">
                    (8342)-23-30-18 И 7-927-640-20-00
                  </p>
                </div>

                {/* Search - Desktop only */}
                <div className="hidden lg:flex items-center gap-2">
                  <input
                    type="search"
                    placeholder="Search"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary w-40"
                  />
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Поиск
                  </Button>
                </div>

                {/* Mobile Menu Button */}
                <MobileNav categories={categories} navigationItems={navigationItems.slice(1)} />
              </div>
            </div>

            {/* Mobile Search Bar - Full width below header */}
            <div className="lg:hidden pb-3">
              <div className="flex items-center gap-2">
                <input
                  type="search"
                  placeholder="Поиск товаров..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="sm" className="bg-primary hover:bg-primary/90 shrink-0">
                  Поиск
                </Button>
              </div>
            </div>

            {/* Navigation tabs - Hidden on mobile */}
            <nav className="hidden lg:flex items-center justify-center py-2">
              <div className="flex gap-2">
                {/* Catalog with dropdown */}
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="h-10 px-4">
                        Каталог
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {categories.map((category) => (
                            <li key={category.id}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={`/categories/${category.id}`}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {category.name}
                                  </div>
                                  {category.description && (
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {category.description}
                                    </p>
                                  )}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                {/* Other navigation items as buttons */}
                {navigationItems.slice(1).map((item) => (
                  <Button key={item.href} variant="outline" asChild>
                    <Link href={item.href}>{item.name}</Link>
                  </Button>
                ))}
              </div>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
