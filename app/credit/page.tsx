import { Metadata } from "next";
import Image from "next/image";
import { CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Покупка в кредит - Офелия",
  description: "Покупайте бытовую технику в кредит от наших партнёров - Почта Банк, НАКТА и Банк Траст",
};

interface CreditPartner {
  name: string;
  logo: string;
}

const creditPartners: CreditPartner[] = [
  {
    name: "Почта Банк",
    logo: "/credit/pochtabank.png"
  },
  {
    name: "НАКТА",
    logo: "/credit/nakta.jpg"
  },
  {
    name: "Банк Траст",
    logo: "/credit/trust.png"
  }
];

export default function CreditPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Покупать в кредит у нас очень легко
          </h1>
          <CreditCard className="h-8 w-8 md:h-10 md:w-10 text-primary" />
        </div>
      </div>

      {/* Partners Section */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Кредиты предоставляют:
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {creditPartners.map((partner) => (
            <div
              key={partner.name}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 p-6 md:p-8 flex items-center justify-center aspect-video hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative w-full h-full">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Partner Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 md:p-8 border border-blue-200 dark:border-blue-800 mb-8">
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-center">
          Дополнительный партнёр
        </h3>
        <p className="text-base md:text-lg text-center leading-relaxed">
          Также можно оформить кредит у нашего партнёра <strong>Кредитный кооператив &ldquo;Партнер&rdquo;</strong>
        </p>
      </div>

      {/* Info Section */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 md:p-8 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl md:text-2xl font-bold mb-4">
          Как оформить кредит
        </h3>
        <div className="space-y-4 text-base md:text-lg">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              1
            </span>
            <p>Выберите товар в нашем магазине</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              2
            </span>
            <p>Обратитесь к консультанту для оформления кредита</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              3
            </span>
            <p>Заполните простую анкету (паспорт и СНИЛС)</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              4
            </span>
            <p>Получите решение за несколько минут</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
              5
            </span>
            <p>Заберите покупку сразу после одобрения кредита</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
          <p className="text-base md:text-lg">
            <strong>Обратите внимание:</strong> условия кредитования (процентная ставка, срок, первоначальный взнос)
            определяются партнёром индивидуально после рассмотрения заявки.
          </p>
        </div>
      </div>
    </div>
  );
}
