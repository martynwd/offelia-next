"use client";

import { useEffect, useRef } from "react";

interface YandexMapProps {
  mapScript: string;
}

export function YandexMap({ mapScript }: YandexMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create script element
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.charset = "utf-8";
    script.async = true;
    script.src = mapScript;

    // Append to container
    containerRef.current.appendChild(script);

    // Cleanup
    return () => {
      if (containerRef.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [mapScript]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[300px] md:h-[400px] lg:h-[457px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
    />
  );
}
