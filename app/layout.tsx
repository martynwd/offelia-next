import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { getMenuCategories } from "@/lib/db";

export const metadata: Metadata = {
  title: "Offelia Store",
  description: "Product catalog and store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = getMenuCategories();

  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-800 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold hover:text-gray-300">
                Offelia Store
              </Link>
              <div className="flex gap-6 items-center">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.id}`}
                    className="hover:text-gray-300 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
                <Link
                  href="/admin"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
                >
                  Admin
                </Link>
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
