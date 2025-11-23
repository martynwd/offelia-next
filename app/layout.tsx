import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/lib/db";

export const metadata: Metadata = {
  title: "Offelia Store",
  description: "Product catalog and store",
};

const navigationItems = [
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
    <html lang="en">
      <body>
        <nav className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
                Offelia Store
              </Link>
              <div className="flex gap-4 items-center">
                <NavigationMenu>
                  <NavigationMenuList>
                    {/* Catalog dropdown with categories */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Каталог</NavigationMenuTrigger>
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

                    {/* Other navigation items */}
                    {navigationItems.map((item) => (
                      <NavigationMenuItem key={item.href}>
                        <Link href={item.href} legacyBehavior passHref>
                          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            {item.name}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
                <Button asChild variant="default">
                  <Link href="/admin">Admin</Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
