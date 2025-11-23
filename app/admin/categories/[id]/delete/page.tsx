import { notFound, redirect } from "next/navigation";
import { getCategoryById, deleteCategory, getProductsByCategoryId } from "@/lib/db";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DeleteCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const categoryId = parseInt(id, 10);

  if (isNaN(categoryId)) {
    notFound();
  }

  const category = getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategoryId(categoryId);

  async function handleDelete(formData: FormData) {
    "use server";

    deleteCategory(categoryId);
    redirect("/admin");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Delete Category</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded">
          <p className="text-red-800 dark:text-red-200 font-semibold">
            Warning: You are about to delete this category!
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
          {category.description && (
            <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
          )}
        </div>

        {products.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded">
            <p className="text-yellow-800 dark:text-yellow-200">
              This category has {products.length} product(s). Deleting it may cause issues with those products.
            </p>
          </div>
        )}

        <form action={handleDelete} className="flex gap-4">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Confirm Delete
          </button>
          <a
            href="/admin"
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors inline-block"
          >
            Cancel
          </a>
        </form>
      </div>
    </div>
  );
}
