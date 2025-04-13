// components/MapCreateModal.tsx
import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MapCreateModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-center items-center z-60"
      onClick={onClose}
    >
      <div
        className="bg-white w-96 max-w-full rounded-lg p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-lg font-bold text-gray-600 hover:text-black"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">新規マップを作成</h2>

        {/* 仮の入力フィールド */}
        <input
          type="text"
          placeholder="マップ名を入力"
          className="w-full px-4 py-2 border rounded mb-4"
        />

        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          作成
        </button>
      </div>
    </div>
  );
};

export default MapCreateModal;
