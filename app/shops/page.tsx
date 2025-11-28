import { Metadata } from "next";
import { YandexMap } from "@/components/yandex-map";

export const metadata: Metadata = {
  title: "Наши Магазины - Офелия",
  description: "Сеть магазинов бытовой техники Офелия в Саранске",
};

interface Shop {
  title: string;
  phone: string;
  address: string;
  mapScript: string;
}

const shops: Shop[] = [
  {
    title: "Магазин на улице Богдана Хмельницкого",
    phone: "230093",
    address: "г. Саранск, ул. Богдана Хмельницкого, дом 66",
    mapScript: "https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A039ac2e63b1372f10973af560cf4826e37a66da72b76e2b6a50e4a87340ed217&width=100%25&height=400&lang=ru_RU&scroll=true"
  },
  {
    title: "Магазин в Доме Быта",
    phone: "311533",
    address: "г. Саранск, ул. Богдана Хмельницкого, дом 33 (Дом Быта)",
    mapScript: "https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A2396a2573ffebe03dcbcbd590c676520ba9c8c912a0688e0f85fbf197b8995d8&width=100%25&height=400&lang=ru_RU&scroll=true"
  },
  {
    title: "Магазин на улице Кирова",
    phone: "233656",
    address: "г. Саранск, ул. Кирова, дом 63к3",
    mapScript: "https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A505bb3b8db6a9b17130bd82a3f9c968a2351baa3dbc4fd39d6348d6b9d2c3d9e&width=100%25&height=400&lang=ru_RU&scroll=true"
  }
];

export default function ShopsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
        Наши Магазины
      </h1>

      <div className="space-y-8 md:space-y-12">
        {shops.map((shop, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary">
                {shop.title}
              </h2>
              <div className="space-y-2 mb-6">
                <p className="text-lg md:text-xl flex items-center gap-2">
                  <span className="font-semibold">Телефон для связи:</span>
                  <a
                    href={`tel:${shop.phone}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    {shop.phone}
                  </a>
                </p>
                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300">
                  {shop.address}
                </p>
              </div>

              {/* Map Container */}
              <YandexMap mapScript={shop.mapScript} />
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-12 p-6 md:p-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-xl md:text-2xl font-bold mb-4">
          Режим работы
        </h3>
        <p className="text-base md:text-lg leading-relaxed">
          Режим работы магазинов с <strong>9:00 до 19:00</strong> без перерывов и выходных
        </p>
        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
          <p className="text-base md:text-lg mb-2">
            <strong>Оформление онлайн заказов по телефонам:</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            <a
              href="tel:8342233018"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-lg transition-colors"
            >
              (8342) 23-30-18
            </a>
            <a
              href="tel:+79276402000"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-lg transition-colors"
            >
              +7 (927) 640-20-00
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
