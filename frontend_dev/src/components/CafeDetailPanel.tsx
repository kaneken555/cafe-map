// components/CafeDetailPanel.tsx
import React from "react";
import CafeDetailCard from "./CafeDetailCard";

interface CafeData {
  name: string;
  address: string;
  photoUrl: string;
  openingHours: string;
  priceLevel: string;
}

interface Props {
  cafe: CafeData | null;
  onClose: () => void;
}

const CafeDetailPanel: React.FC<Props> = ({ cafe, onClose }) => {
    return (
      <div
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40
          ${cafe ? "translate-x-0" : "-translate-x-full"}`}
      >

        <div className="p-2">
          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-lg font-bold text-gray-600 hover:text-black"
          >
            ×
          </button>
        </div>

        <CafeDetailCard
            cafe={{
                name: "スターバックス コーヒー",
                name_en: "SHIBUYA TSUTAYA 1F店",
                price_day: "￥999",
                price_night: "￥999",
                status: "現在営業中",
                hours: "07:00 - 22:30",
                mapUrl: "https://maps.google.com/...",
                photoUrl: "https://your-image-url",
            }}
            />

      </div>
    );
  };
  

export default CafeDetailPanel;
