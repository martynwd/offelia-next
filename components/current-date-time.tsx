"use client";

import { useEffect, useState } from "react";

export function CurrentDateTime() {
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    // Set initial date
    const formatDate = () => {
      return new Date().toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    setCurrentDate(formatDate());

    // Update every minute
    const interval = setInterval(() => {
      setCurrentDate(formatDate());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!currentDate) {
    // Return placeholder during SSR
    return (
      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
        Loading...
      </p>
    );
  }

  return (
    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
      {currentDate}
    </p>
  );
}
