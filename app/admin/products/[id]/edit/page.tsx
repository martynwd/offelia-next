import { notFound, redirect } from "next/navigation";
import { getProductById, updateProduct, getAllCategories } from "@/lib/db";
import { AdminAuthGuard } from "@/components/admin-auth-guard";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) {
    notFound();
  }

  const product = getProductById(productId);

  if (!product) {
    notFound();
  }

  const categories = getAllCategories();

  async function handleSubmit(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = parseInt(formData.get("categoryId") as string, 10);
    const availability = formData.get("availability") === "on";
    const photoUrl = formData.get("photoUrl") as string;

    updateProduct(productId, name, description || null, price, categoryId, availability, photoUrl || null);

    redirect("/admin");
  }

  return (
    <AdminAuthGuard>
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Edit Product</h1>

      <form action={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={product.name}
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
            defaultValue={product.description || ""}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            Price *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            min="0"
            required
            defaultValue={product.price || 0}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="categoryId" className="block text-sm font-medium mb-2">
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={product.category_id}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="photoUrl" className="block text-sm font-medium mb-2">
            Photo URL
          </label>
          <input
            type="url"
            id="photoUrl"
            name="photoUrl"
            placeholder="https://example.com/image.jpg"
            defaultValue={product.photo_url || ""}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="availability"
              defaultChecked={product.avialability || false}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium">Available for purchase</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Update Product
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
