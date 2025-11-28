import { Metadata } from "next";
import { ServiceBrandCard } from "@/components/service-brand-card";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Сервисное обслуживание - Офелия",
  description: "Гарантийное и послегарантийное обслуживание бытовой техники в Саранске",
};

interface ServiceBrand {
  name: string;
  logo: string;
  mapUrl: string;
}

const serviceBrands: ServiceBrand[] = [
  {
    name: "Tefal",
    logo: "/brands/tefal.png",
    mapUrl: "https://yandex.ru/map-widget/v1/?um=constructor%3A47a053c251a04a18a38a01cf8a6c2a5133004e11f405f1c12fa66d4869864270&source=constructor"
  },
  {
    name: "Bosch",
    logo: "/brands/bosch.png",
    mapUrl: "https://yandex.ru/map-widget/v1/?um=constructor%3A47a053c251a04a18a38a01cf8a6c2a5133004e11f405f1c12fa66d4869864270&source=constructor"
  },
  {
    name: "BBK",
    logo: "/brands/bbk.jpg",
    mapUrl: "https://yandex.ru/map-widget/v1/?um=constructor%3A2955eb05f025b9a4fff65fd4d680c8de3217d529c37eeb7a0e80587c95a45018&source=constructor"
  },
  {
    name: "Hotpoint",
    logo: "/brands/hotpoint.png",
    mapUrl: "https://yandex.ru/map-widget/v1/?um=constructor%3A2955eb05f025b9a4fff65fd4d680c8de3217d529c37eeb7a0e80587c95a45018&source=constructor"
  },
  {
    name: "Atlant",
    logo: "/brands/atlant.png",
    mapUrl: "https://yandex.ru/map-widget/v1/?um=constructor%3A2955eb05f025b9a4fff65fd4d680c8de3217d529c37eeb7a0e80587c95a45018&source=constructor"
  },
  {
    name: "LG",
    logo: "/brands/lg.png",
    mapUrl: "https://yandex.ru/map-widget/v1/?um=constructor%3A2955eb05f025b9a4fff65fd4d680c8de3217d529c37eeb7a0e80587c95a45018&source=constructor"
  },
  {
    name: "Stinol",
    logo: "/brands/stinol.png",
    mapUrl: "https://yandex.ru/map-widget/v1/?um=constructor%3A2955eb05f025b9a4fff65fd4d680c8de3217d529c37eeb7a0e80587c95a45018&source=constructor"
  },
  {
    name: "Gefest",
    logo: "/brands/gefest.png",
    mapUrl: "https://yandex.ru/map-widget/v1/?um=constructor%3Acda00c5eaddd83c1c4d3f75d2eee7b6eaeb61d0e8e36db15da653c2c65e8c5b4&source=constructor"
  }
];

export default function ServicePage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Гарантийное обслуживание
          </h1>
          <Shield className="h-8 w-8 md:h-10 md:w-10 text-primary" />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 md:p-8 border border-blue-200 dark:border-blue-800">
          <p className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-700 dark:text-gray-300">
            На всю купленную у нас технику предоставляется гарантия.
            Гарантийное и послегарантийное обслуживание производится в сервисных центрах города.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-6 md:mb-8">
          Нажмите на нужный логотип, чтобы узнать где находится нужный вам сервис:
        </h2>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {serviceBrands.map((brand) => (
          <ServiceBrandCard
            key={brand.name}
            name={brand.name}
            logo={brand.logo}
            mapUrl={brand.mapUrl}
          />
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-12 p-6 md:p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl md:text-2xl font-bold mb-4">
          Дополнительная информация
        </h3>
        <div className="space-y-3 text-base md:text-lg">
          <p>
            Для получения гарантийного обслуживания необходимо предоставить:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Гарантийный талон с отметкой магазина</li>
            <li>Товарный или кассовый чек</li>
            <li>Паспорт на изделие (при наличии)</li>
          </ul>
          <p className="mt-4">
            <strong>Обратите внимание:</strong> сроки гарантии указаны в гарантийном талоне и зависят от типа техники.
          </p>
        </div>
      </div>
    </div>
  );
}
