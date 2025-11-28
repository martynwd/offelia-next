"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (url: string) => void;
  name?: string;
}

export function ImageUpload({ currentImageUrl, onImageChange, name = "image_url" }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(currentImageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setImageUrl(data.url);
      onImageChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setPreviewUrl("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreviewUrl(url);
    onImageChange(url);
    setError("");
  };

  const clearImage = () => {
    setImageUrl("");
    setPreviewUrl("");
    onImageChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden input to store the URL for form submission */}
      <input type="hidden" name={name} value={imageUrl} />

      {/* Preview */}
      {previewUrl && (
        <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-contain"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Upload Button */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Upload Image
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded transition-colors"
          >
            {isUploading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Choose File
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Max 5MB. Supports: JPG, PNG, GIF, WebP
        </p>
      </div>

      {/* Manual URL Input */}
      <div>
        <label htmlFor="manual_url" className="block text-sm font-medium mb-2">
          Or Enter Image URL
        </label>
        <input
          type="text"
          id="manual_url"
          value={imageUrl}
          onChange={handleUrlChange}
          placeholder="/slider1.png or https://..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
          <X className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Current URL Display */}
      {imageUrl && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Current URL:</strong> {imageUrl}
        </div>
      )}
    </div>
  );
}
