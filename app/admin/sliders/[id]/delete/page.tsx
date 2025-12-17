import { getSliderById, deleteSlider } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DeleteSliderPage({ params }: PageProps) {
  const { id } = await params;
  const sliderId = parseInt(id, 10);

  if (isNaN(sliderId)) {
    notFound();
  }

  const slider = getSliderById(sliderId);

  if (!slider) {
    notFound();
  }

  async function handleDelete() {
    "use server";
    deleteSlider(sliderId);
    redirect("/admin/sliders");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Delete Slider</h1>
        <Link
          href="/admin/sliders"
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
        >
          ← Back to Sliders
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl">
        <div className="mb-6">
          <p className="text-red-600 dark:text-red-400 text-lg font-semibold mb-4">
            Are you sure you want to delete this slider?
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This action cannot be undone.
          </p>

          {/* Slider Preview */}
          <div className="border border-gray-300 dark:border-gray-600 rounded p-4">
            <div className="relative w-full h-48 bg-gray-200 rounded overflow-hidden mb-4">
              <Image
                src={slider.image_url}
                alt={slider.title || `Slider ${slider.id}`}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              {slider.title || "Untitled"}
            </h3>
            {slider.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {slider.description}
              </p>
            )}
            <div className="flex items-center gap-3">
              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                Order: {slider.order_index}
              </span>
              {slider.is_active ? (
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                  Active
                </span>
              ) : (
                <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                  Inactive
                </span>
              )}
            </div>
          </div>
        </div>

        <form action={handleDelete} className="flex gap-3">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors"
          >
            Yes, Delete Slider
          </button>
          <Link
            href="/admin/sliders"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded transition-colors inline-block"
          >
            Cancel
          </Link>
        </form>
      </div>
    </div>
  );
}
