"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImageUpload } from "@/components/image-upload";

export default function NewSliderPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/sliders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: imageUrl,
          title: formData.get("title"),
          description: formData.get("description"),
          link_url: formData.get("link_url"),
          order_index: parseInt(formData.get("order_index") as string, 10) || 0,
          is_active: formData.get("is_active") === "on",
        }),
      });

      if (response.ok) {
        router.push("/admin/sliders");
        router.refresh();
      } else {
        alert("Failed to create slider");
      }
    } catch (error) {
      console.error("Error creating slider:", error);
      alert("Failed to create slider");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Add New Slider</h1>
        <Link
          href="/admin/sliders"
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
        >
          ← Back to Sliders
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <ImageUpload
            currentImageUrl=""
            onImageChange={setImageUrl}
            name="image_url"
          />

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title (optional)
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Slide title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Slide description"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
            />
          </div>

          <div>
            <label htmlFor="link_url" className="block text-sm font-medium mb-2">
              Link URL (optional)
            </label>
            <input
              type="text"
              id="link_url"
              name="link_url"
              placeholder="/products/123"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
            />
          </div>

          <div>
            <label htmlFor="order_index" className="block text-sm font-medium mb-2">
              Order Index
            </label>
            <input
              type="number"
              id="order_index"
              name="order_index"
              defaultValue={0}
              min={0}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Lower numbers appear first
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              defaultChecked
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="is_active" className="ml-2 text-sm font-medium">
              Active (shown on homepage)
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !imageUrl}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded transition-colors"
            >
              {isSubmitting ? "Creating..." : "Create Slider"}
            </button>
            <Link
              href="/admin/sliders"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
