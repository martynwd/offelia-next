import Link from "next/link";
import { getAllCategories, getActiveSliders } from "@/lib/db";
import { HomepageSlider } from "@/components/homepage-slider";

export default function Home() {
  const categories = getAllCategories();
  const slides = getActiveSliders();

  // Get current date and time in Russian format
  const currentDate = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div>
      {/* Hero Slider */}
      <section className="mb-12 flex justify-center items-center max-sm:hidden">
        <HomepageSlider slides={slides} />
      </section>

      {/* Categories Section */}
      <section className="mb-12">
          <div className="p-8 border border-accent rounded-[36px] text-[32px]">
              <p>
                  Режим работы магазинов с 9:00 до 19:00 без перерывов и выходных <br />
                  Оформление онлайн заказов по телефонам: 23-30-18 и +7-927-640-20-00. <br />
                  Оплатить можно на карту Альфабанка:{' '}
                  <strong>2200 1505 3017 9776</strong>  <br />или на карту Сбербанка:{' '}
                  <strong>2202 2032 1479 6528</strong>, <br /> обязательно при этом указав номер заказа
              </p>
          </div>
          <div className="p-8 border border-accent rounded-[36px] text-[32px] mt-8">
              <p>
                  Цены актуальны на: {currentDate}
              </p>
          </div>
      </section>
    </div>
  );
}
