import { Metadata } from "next";
import { Truck, Package, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Доставка - Офелия",
  description: "Условия доставки бытовой техники по Саранску и Мордовии",
};

export default function DeliveryPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Доставка
          </h1>
          <Truck className="h-8 w-8 md:h-10 md:w-10 text-primary" />
        </div>
      </div>

      {/* Pricing Section */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Стоимость доставки по г. Саранску и пригороду в пределах 20 км:
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-colors">
            <div className="flex items-center justify-center mb-3">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-center mb-2">До 20 кг</h3>
            <p className="text-3xl font-bold text-primary text-center">400₽</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-colors">
            <div className="flex items-center justify-center mb-3">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-center mb-2">До 100 кг</h3>
            <p className="text-3xl font-bold text-primary text-center">700₽</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-colors">
            <div className="flex items-center justify-center mb-3">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-center mb-2">Свыше 100 кг</h3>
            <p className="text-3xl font-bold text-primary text-center">1000₽</p>
          </div>
        </div>

        <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-base md:text-lg text-center">
            <strong>При покупке нескольких вещей</strong> складывается общий вес покупки и определяется стоимость доставки.
          </p>
        </div>
      </div>

      {/* Distance Pricing */}
      <div className="mb-8 md:mb-12 p-6 md:p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl md:text-2xl font-bold mb-4">
          Доставка за пределы 20 км
        </h3>
        <div className="space-y-3 text-base md:text-lg">
          <p>
            <strong>От 20 км до 150 км</strong> — 28 рублей за один километр
          </p>
          <p>
            <strong>Свыше 150 км</strong> — 20 рублей за один километр до места передачи товара
          </p>
        </div>
      </div>

      {/* Delivery Terms */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Условия доставки
        </h2>

        <div className="space-y-4">
          <p className="text-base md:text-lg leading-relaxed">
            Товар доставляется по адресу, указанному Клиентом в согласованную при покупке дату:
          </p>

          <ul className="space-y-3 text-base md:text-lg">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>Если обратная телефонная связь с Клиентом отсутствует, доставка товара переносится на следующую дату.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>В случае отсутствия Клиента по указанному адресу доставки в назначенное время, Клиенту необходимо обратиться за информацией в магазин. Повторная доставка оформляется и оплачивается Клиентом отдельно.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>Услуга &ldquo;доставка&rdquo; может быть перенесена на другой день по инициативе Клиента, но не менее чем, за 1 день до даты, указанной Клиентом в Заявке на доставку.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>Доставленный Товар передается Клиенту на основании предъявленного оригинала кассового (фискального) чека.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>Доставка осуществляется при беспрепятственном подъездном пути к подъезду многоэтажного дома или частному дома Клиента.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Handling Info */}
      <div className="mb-8 md:mb-12 p-6 md:p-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <p className="text-base md:text-lg">
              <strong>Купленный товар заносится за порог помещения</strong>, указанный в талоне доставки, дальнейшее перемещение товара по помещению не осуществляются.
            </p>
            <p className="text-base md:text-lg">
              В случае если габариты товара в упаковке превышают размеры лестничных маршей, площадок, входных дверей, товар будет передан перед подъездом.
            </p>
          </div>
        </div>
      </div>

      {/* Inspection Requirements */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Проверка товара при получении
        </h2>

        <div className="space-y-4 p-6 md:p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-base md:text-lg">
            <strong>Покупателю необходимо проверить внешний вид и комплектность Товара:</strong>
          </p>

          <ul className="space-y-3 text-base md:text-lg">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>Проверить комплектность всего заказа и каждого товара по отдельности</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>Убедиться в работоспособности ручек, защёлок и других механических узлов</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
              <span>Убедиться в отсутствии на Товаре механических повреждений сколов, трещин, вмятин и прочих повреждений, если у покупателя не возникает претензий, он подписывает акт приема передачи с указанием Ф.И.О. и даты получения Товара.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Important Warning */}
      <div className="p-6 md:p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-300 dark:border-red-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-red-900 dark:text-red-100">
              Важно!
            </h3>
            <p className="text-base md:text-lg text-red-900 dark:text-red-100">
              После подписания покупателем талона доставки претензии по внешнему виду и комплектации <strong>НЕ ПРИНИМАЮТСЯ!</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
