import { Metadata } from "next";
import Image from "next/image";
import { Phone, Mail, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Обратная связь - Офелия",
  description: "Свяжитесь с нами по телефону или электронной почте",
};

export default function FeedbackPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Вы можете обратиться к нам по любому вопросу
          </h1>
          <MessageSquare className="h-8 w-8 md:h-10 md:w-10 text-primary" />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
        {/* Image Section */}
        <div className="lg:col-span-2">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl border-2 border-gray-200 dark:border-gray-700">
            <Image
              src="/contact-image.jpg"
              alt="Обратная связь"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="space-y-6">
          {/* Phone Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">Наш телефон:</h3>
            </div>
            <a
              href="tel:8342233018"
              className="text-lg md:text-xl text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
            >
              (8342) 23-30-18
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold">Наша почта:</h3>
            </div>
            <a
              href="mailto:verous@moris.ru"
              className="text-lg md:text-xl text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors break-all"
            >
              verous@moris.ru
            </a>
          </div>
        </div>
      </div>

      {/* Additional Contact Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 md:p-8 border border-blue-200 dark:border-blue-800">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Как с нами связаться
        </h2>
        <div className="space-y-4 text-base md:text-lg">
          <div className="flex items-start gap-3">
            <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold mb-1">По телефону:</p>
              <p>Звоните нам по номеру <strong>(8342) 23-30-18</strong> в рабочее время с 9:00 до 19:00</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold mb-1">По электронной почте:</p>
              <p>Отправьте ваш вопрос на <strong>verous@moris.ru</strong> и мы ответим вам в течение рабочего дня</p>
            </div>
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="mt-8 p-6 md:p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl md:text-2xl font-bold mb-4">
          Режим работы
        </h3>
        <p className="text-base md:text-lg">
          Наши магазины работают <strong>с 9:00 до 19:00</strong> без перерывов и выходных
        </p>
      </div>
    </div>
  );
}
