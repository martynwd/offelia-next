import Link from "next/link";
import { getAllCategories, getActiveSliders } from "@/lib/db";
import { HomepageSlider } from "@/components/homepage-slider";
import { Clock, Phone, CreditCard, Calendar } from "lucide-react";
import { CurrentDateTime } from "@/components/current-date-time";

export default function Home() {
  const categories = getAllCategories();
  const slides = getActiveSliders();

  return (
    <div>
      {/* Hero Slider */}
        <section className="mb-12 max-sm:hidden flex justify-center">
            <HomepageSlider slides={slides} />
        </section>
      {/* Info Cards Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Working Hours */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex-shrink-0">
                <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Режим работы</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  с 9:00 до 19:00
                </p>
                <p className="text-lg text-green-600 dark:text-green-400 font-semibold mt-2">
                  без перерывов и выходных
                </p>
              </div>
            </div>
          </div>

          {/* Contact Phones */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl flex-shrink-0">
                <Phone className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">Телефоны</h3>
                <div className="space-y-2">
                  <a
                    href="tel:+78342233018"
                    className="block text-blue-600 dark:text-blue-400 hover:underline font-semibold text-xl"
                  >
                    23-30-18
                  </a>
                  <a
                    href="tel:+79276402000"
                    className="block text-blue-600 dark:text-blue-400 hover:underline font-semibold text-xl"
                  >
                    +7-927-640-20-00
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex-shrink-0">
                <CreditCard className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-2xl font-bold mb-3">Оплата</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1 text-sm">Альфабанк:</p>
                    <p className="font-mono font-bold text-gray-900 dark:text-white text-lg break-all">
                      2200 1505 3017 9776
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1 text-sm">Сбербанк:</p>
                    <p className="font-mono font-bold text-gray-900 dark:text-white text-lg break-all">
                      2202 2032 1479 6528
                    </p>
                  </div>
                  <p className="text-orange-600 dark:text-orange-400 text-sm mt-2 font-medium">
                    ⚠️ Указывайте номер заказа
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Update Info */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-lg p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-blue-600 dark:bg-blue-500 rounded-xl flex-shrink-0">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Цены актуальны</h2>
                <div className="dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Обновлено:
                  </p>
                  <CurrentDateTime />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Categories Grid */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Каталог товаров</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-primary"
            >
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
        {categories.length > 8 && (
          <div className="text-center mt-8">
            <Link
              href="/categories"
              className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Посмотреть все категории
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
