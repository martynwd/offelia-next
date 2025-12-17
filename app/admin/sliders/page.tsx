import { getAllSliders } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

export default async function AdminSlidersPage() {
  const sliders = getAllSliders();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Manage Sliders</h1>
        <div className="flex gap-3">
          <Link
            href="/admin"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <Link
            href="/admin/sliders/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Add Slider
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {sliders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No sliders yet. Create your first one!
          </p>
        ) : (
          <div className="space-y-4">
            {sliders.map((slider) => (
              <div
                key={slider.id}
                className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {/* Preview Image */}
                <div className="relative w-32 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={slider.image_url}
                    alt={slider.title || `Slider ${slider.id}`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Slider Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {slider.title || "Untitled"}
                  </h3>
                  {slider.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {slider.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
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

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/admin/sliders/${slider.id}/edit`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/admin/sliders/${slider.id}/delete`}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Delete
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
