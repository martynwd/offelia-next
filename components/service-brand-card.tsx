"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ServiceBrandCardProps {
  name: string;
  logo: string;
  mapUrl: string;
}

export function ServiceBrandCard({ name, logo, mapUrl }: ServiceBrandCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Brand Card */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary p-4 md:p-6 aspect-square flex items-center justify-center"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={logo}
            alt={`${name} сервис`}
            fill
            className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl md:text-2xl font-bold">
                Сервисный центр {name}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Закрыть"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Map */}
            <div className="w-full h-[300px] md:h-[400px] lg:h-[500px]">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                className="w-full h-full"
                title={`Карта сервисного центра ${name}`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
