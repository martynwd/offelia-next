import Link from "next/link";
import { getAllCategories } from "@/lib/db";

export default function Home() {
  const categories = getAllCategories();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Welcome to Offelia Store</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              {category.description && (
                <p className="text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
