// components/CafeImageCarousel.tsx
import { useState } from "react";

interface CafeImageCarouselProps {
  photoUrls: string[];
  altText: string;
}

const CafeImageCarousel: React.FC<CafeImageCarouselProps> = ({ photoUrls, altText }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? photoUrls.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photoUrls.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mt-4 relative">
      {/* 現在の画像 */}
      <img
        src={photoUrls[currentIndex]}
        alt={altText}
        className="rounded-xl w-full object-cover"
      />

      {/* ← / → ボタン */}
      {photoUrls.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 rounded-full p-1 cursor-pointer"
          >
            ◀
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 rounded-full p-1 cursor-pointer"
          >
            ▶
          </button>
        </>
      )}

      {/* インジケーター */}
      <div className="flex justify-center mt-2 space-x-1">
        {photoUrls.map((_, index) => (
          <span
            key={index}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? "bg-gray-800" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CafeImageCarousel;
