// components/MapDeleteModal.tsx
import React from "react";
import { MODAL_STYLES } from "../constants/ui";

interface MapDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mapName: string;
}

const MapDeleteModal: React.FC<MapDeleteModalProps> = ({ isOpen, onClose, onConfirm, mapName }) => {
  if (!isOpen) return null;

  return (
    <div className={MODAL_STYLES.SUB_MODAL.CONTAINER}>
      <div className="bg-[#fffaf0] p-6 rounded-lg shadow-lg w-80">
        <h2 className={MODAL_STYLES.SUB_MODAL.TITLE}>マップ削除確認</h2>
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
