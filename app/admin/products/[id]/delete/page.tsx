"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  category_id: number;
  avialability: boolean;
}

interface Category {
  id: number;
  name: string;
}

export default function DeleteProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string, 10);

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem('admin_token');
          router.push('/admin/login');
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        router.push('/admin/login');
      });
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchData() {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data.product);
          setCategory(data.category);
        } else {
          router.push('/admin');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push('/admin');
      } finally {
        setIsLoading(false);
      }
    }

    if (!isNaN(productId)) {
      fetchData();
    }
  }, [productId, router, isAuthenticated]);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        router.push('/admin');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return null;
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

        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
