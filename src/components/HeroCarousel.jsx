import { useState, useEffect } from "react";

export default function HeroCarousel({ images, interval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div
      className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg shadow-lg mb-8 transition-transform duration-75 will-change-transform"
    >
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Meal ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />
      ))}
    </div>
  );
}
