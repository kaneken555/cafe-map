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

    </div>
  );
};
  

export default CafeDetailPanel;
