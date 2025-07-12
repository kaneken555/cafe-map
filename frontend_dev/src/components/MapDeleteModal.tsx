// components/MapDeleteModal.tsx
import React from "react";
import BaseModal from "./BaseModal";


interface MapDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mapName: string;
}

const MapDeleteModal: React.FC<MapDeleteModalProps> = ({ isOpen, onClose, onConfirm, mapName }) => {
  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="マップ削除確認" size="sm">

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

    </BaseModal>
  );
};

export default MapDeleteModal;
