// components/MyCafeListPanel.tsx
import React from "react";
import { Cafe } from "../api/mockCafeData"; // ✅ Cafe型をインポート


interface MyCafeListPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cafes: Cafe[];
}


const MyCafeListPanel: React.FC<MyCafeListPanelProps> = ({ isOpen, onClose, cafes }) => {
  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-[400px] bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full overflow-y-auto p-4 relative">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-lg font-bold text-gray-600 hover:text-black"
        >
          ×
        </button>
        <div className="text-2xl font-bold mb-4">My Café List</div>
          <input
            type="text"
            placeholder="キーワードを入力"
            className="w-full mb-4 px-3 py-2 border rounded focus:outline-none"
          />
        {/* カフェリスト */}
        {cafes.length === 0 ? (
          <p className="text-gray-500 text-sm">このマップにカフェは登録されていません。</p>
        ) : (
          cafes.map((cafe, i) => (
            <div key={i} className="flex items-center justify-between mb-4">
              <div>
                <div className="font-bold text-sm">{cafe.name}</div>
                <div className="text-blue-600 text-xs font-semibold">{cafe.status}</div>
                <div className="text-xs text-gray-500">{cafe.openTime}</div>
                <div className="text-xs text-gray-500">{cafe.distance}</div>
              </div>
              <img
                src={cafe.photoUrls?.[0] || "/no-image.png"}
                alt={cafe.name}
                className="w-16 h-16 rounded object-cover ml-2"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyCafeListPanel;
