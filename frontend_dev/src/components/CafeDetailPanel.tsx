// components/CafeDetailPanel.tsx
import React from "react";
import CafeDetailCard from "./CafeDetailCard";
import { Cafe } from "../api/mockCafeData"; // 👈 Cafe 型を import


interface Props {
  cafe: Cafe | null;
  onClose: () => void;
  selectedMap: { id: number; name: string } | null;
}

const CafeDetailPanel: React.FC<Props> = ({ cafe, onClose, selectedMap }) => {
    return (
      <div
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-[400px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40
          ${cafe ? "translate-x-0" : "-translate-x-full"}`}
      >

        <div className="p-1">
          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute top-0 right-3 text-lg font-bold text-gray-600 hover:text-black"
          >
            ×
          </button>
        </div>

        {cafe && <CafeDetailCard cafe={cafe} selectedMap={selectedMap} />}

        {/* <CafeDetailCard */}
          {/* // cafe={cafe} */}
            {/* // cafe={{ */}
            {/* //     name: "スターバックス コーヒー",
            //     name_en: "SHIBUYA TSUTAYA 1F店",
            //     price_day: "￥999",
            //     price_night: "￥999",
            //     status: "現在営業中",
            //     hours: "07:00 - 22:30",
            //     mapUrl: "https://maps.google.com/...",
            //     photoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Starbucks_Coffee_restaurant.png",
            //     address: "東京都渋谷区宇田川町21-6",
            //     rating: 4.5, */}
            {/* // }} */}
            {/* // /> */}

      </div>
    );
  };
  

export default CafeDetailPanel;
