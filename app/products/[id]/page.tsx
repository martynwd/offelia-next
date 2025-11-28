import { notFound } from "next/navigation";
import { getProductById, getCategoryById } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Главная
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/categories/${category?.id}`}
              className="hover:text-foreground transition-colors"
            >
              {category?.name || "Категория"}
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">{product.name}</li>
        </ol>
      </nav>

      {/* Back button */}
      <Link
        href={`/categories/${category?.id}`}
        className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Вернуться к категории
      </Link>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {product.photo_url ? (
            <div className="relative aspect-square w-full bg-gray-100">
              <Image
                src={product.photo_url}
                alt={product.name}
                fill
                className="object-contain p-4"
                priority
              />
            </div>
          ) : (
            <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-32 h-32 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Category badge */}
          {category && (
            <Link
              href={`/categories/${category.id}`}
              className="text-sm text-primary hover:underline mb-2 inline-block w-fit"
            >
              {category.name}
            </Link>
          )}

          {/* Product name */}
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>

          {/* Availability badge */}
          <div className="mb-6">
            {product.avialability ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-md text-sm font-medium">
                <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                В наличии
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-md text-sm font-medium">
                <span className="h-2 w-2 bg-red-600 rounded-full"></span>
                Нет в наличии
              </span>
            )}
          </div>

          {/* Price */}
          <div className="mb-8">
            <div className="text-4xl font-bold text-primary mb-2">
              {product.price ? `${product.price.toFixed(2)} ₽` : "Цена по запросу"}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Описание</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <Button
              size="lg"
              className="flex-1 bg-primary hover:bg-primary/90 h-14 sm:h-12"
              disabled={!product.avialability}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Купить
            </Button>
            <Button size="lg" variant="outline" className="flex-1 h-14 sm:h-12">
              Позвонить
            </Button>
          </div>

          {/* Contact info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-1">Наши телефоны:</p>
            <p className="text-sm text-muted-foreground">
              (8342)-23-30-18 <br />
              7-927-640-20-00
            </p>
          </div>
        </div>
      </div>

      {/* Additional info section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold mb-2">Доставка</h3>
          <p className="text-sm text-muted-foreground">
            Быстрая доставка по Саранску и Республике Мордовия
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold mb-2">Гарантия</h3>
          <p className="text-sm text-muted-foreground">
            Официальная гарантия производителя
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold mb-2">Кредит</h3>
          <p className="text-sm text-muted-foreground">
            Возможность покупки в кредит
          </p>
        </div>
      </div>
    </div>
  );
}
