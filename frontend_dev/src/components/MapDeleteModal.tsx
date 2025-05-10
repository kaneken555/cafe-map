import React from "react";

interface MapDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mapName: string;
}

const MapDeleteModal: React.FC<MapDeleteModalProps> = ({ isOpen, onClose, onConfirm, mapName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-[#fffaf0] p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4 text-[#6b4226]">マップ削除確認</h2>
        <p className="mb-6 text-sm">「{mapName}」を削除してもよろしいですか？</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600 cursor-pointer"
            onClick={onConfirm}
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapDeleteModal;
