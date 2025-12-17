import { notFound, redirect } from "next/navigation";
import { getCategoryById, updateCategory } from "@/lib/db";
import { AdminAuthGuard } from "@/components/admin-auth-guard";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const categoryId = parseInt(id, 10);

  if (isNaN(categoryId)) {
    notFound();
  }

  const category = getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  async function handleSubmit(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const menuDisplay = formData.get("menuDisplay") === "on";

    updateCategory(categoryId, name, description || null, menuDisplay);

    redirect("/admin");
  }

  return (
    <AdminAuthGuard>
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Edit Category</h1>

      <form action={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Category Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={category.name}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={category.description || ""}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="menuDisplay"
              defaultChecked={category.menu_display || false}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium">Display in menu</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Update Category
          </button>
          <a
            href="/admin"
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors inline-block"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
    </AdminAuthGuard>
  );
}
