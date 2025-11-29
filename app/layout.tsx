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
import { SearchBar } from "@/components/search-bar";

export const metadata: Metadata = {
  title: "Офелия - Теле-аудио-бытовая техника",
  description: "Магазин теле видео бытовая техника в Саранске Офелия",
  keywords: "Магазин Офелия Саранск, Бытовая техника, Бытовая техника купить, Бытовая техника Саранск, телевизоры Саранск, пылесосы Саранск, Стиральные машины Саранск, холодильники Саранск",
  openGraph: {
    title: "Офелия - Теле-аудио-бытовая техника",
    description: "Магазин теле видео бытовая техника в Саранске Офелия",
    type: "website",
    locale: "ru_RU",
  },
};

const navigationItems = [
  { name: "Каталог", href: "/", hasDropdown: true },
  { name: "Магазины", href: "/shops" },
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
            <div className="flex items-center justify-between py-3 gap-4">
                {/* Left: Logo and location */}
                <div className="flex flex-col gap-2 shrink-0">
                    <div className="flex items-center gap-2 text-primary">
                        <MapPin className="h-5 w-5" />
                        <span className="font-medium text-sm lg:text-base">Саранск</span>
                    </div>
                    <Link href="/" className="flex flex-col items-center hover:opacity-80 transition-opacity">
                        <img src="/img.png" alt="Офелия" className="max-sm:h-14 lg:h-20" />
                    </Link>
                </div>

                {/* Center: Search - Desktop only */}
                <div className="hidden lg:flex items-center flex-1 max-w-2xl">
                    <SearchBar />
                </div>

              {/* Right: Phone and Mobile Menu */}
              <div className="flex items-center gap-3 min-w-[300px] max-sm:min-w-0 justify-center lg:gap-4 shrink-0">
                {/* Phone - Hidden on mobile */}
                <div className="text-right  hidden md:block">
                  <p className="text-sm font-medium">Наши телефоны:</p>
                  <a
                    href="tel:+78342233018"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                  >
                    (8342)-23-30-18
                  </a>
                  <a
                    href="tel:+79276402000"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                  >
                    7-927-640-20-00
                  </a>
                </div>

                {/* Mobile Menu Button */}
                <MobileNav categories={categories} navigationItems={navigationItems.slice(1)} />
              </div>
            </div>

            {/* Mobile Search Bar - Full width below header */}
            <div className="lg:hidden pb-3">
              <SearchBar isMobile />
            </div>

            {/* Navigation tabs - Hidden on mobile */}
            <nav className="hidden lg:flex items-center justify-center py-2">
              <div className="flex gap-2">
                {/* Catalog with dropdown */}
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="h-10 px-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                        Каталог
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-[800px] max-h-[500px] overflow-y-auto">
                          <ul className="grid grid-cols-3 gap-2 p-3">
                            {categories.map((category) => (
                              <li key={category.id}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={`/categories/${category.id}`}
                                    className="block select-none rounded-md px-3 py-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    <div className="text-sm font-medium">
                                      {category.name}
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
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

        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              {/* Navigation Links */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Навигация</h3>
                <ul className="space-y-2">
                  {navigationItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Контакты</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>
                    <a href="tel:+78342233018" className="hover:text-primary transition-colors">
                      (8342) 23-30-18
                    </a>
                  </li>
                  <li>
                    <a href="tel:+79276402000" className="hover:text-primary transition-colors">
                      +7-927-640-20-00
                    </a>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>Саранск</span>
                  </li>
                </ul>
              </div>

              {/* Working Hours */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Режим работы</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  с 9:00 до 19:00
                  <br />
                  без перерывов и выходных
                </p>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Copyright © 1998-2019 Офелия. Все права защищены
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
