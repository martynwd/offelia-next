import { notFound, redirect } from "next/navigation";
import { getProductById, deleteProduct, getCategoryById } from "@/lib/db";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DeleteProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) {
    notFound();
  }

  const product = getProductById(productId);

  if (!product) {
    notFound();
  }

  const category = getCategoryById(product.category_id);

  async function handleDelete(formData: FormData) {
    "use server";

    deleteProduct(productId);
    redirect("/admin");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Delete Product</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded">
          <p className="text-red-800 dark:text-red-200 font-semibold">
            Warning: You are about to delete this product!
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          {product.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-3">{product.description}</p>
          )}
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Price:</span> ${product.price ? product.price.toFixed(2) : '0.00'}
            </p>
            <p>
              <span className="font-medium">Category:</span> {category?.name || 'Unknown'}
            </p>
            <p>
              <span className="font-medium">Availability:</span>{' '}
              {product.avialability ? (
                <span className="text-green-600 dark:text-green-400">Available</span>
              ) : (
                <span className="text-red-600 dark:text-red-400">Unavailable</span>
              )}
            </p>
          </div>
        </div>

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
