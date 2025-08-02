// components/MapDetailModal/MapDetailModal.tsx
import React, { useState, useEffect } from "react";
import BaseModal from "../BaseModal/BaseModal";
import ModalActionButton from "../ModalActionButton/ModalActionButton";
import { MapItem } from "../../types/map";
import { Map as MapIcon, Save } from "lucide-react";

interface MapDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  map: MapItem | null;
  onUpdateMap: (updatedMap: MapItem) => void;
}

const MapDetailModal: React.FC<MapDetailModalProps> = ({
  isOpen,
  onClose,
  map,
  onUpdateMap,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMap, setUpdatedMap] = useState<MapItem | null>(map);

  useEffect(() => {
    if (map) {
      setUpdatedMap({ ...map });
    }
  }, [map]);

  if (!map) return null;

  const handleUpdate = () => {
    if (updatedMap) {
      onUpdateMap(updatedMap);
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof MapItem) => {
    if (updatedMap) {
      setUpdatedMap({
        ...updatedMap,
        [field]: e.target.value,
      });
    }
  };


  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="マップ詳細"
      icon={<MapIcon className="w-6 h-6 text-[#6b4226]" />}
      size="md"
    >
      <div className="space-y-4">
        {/* マップ名 */}
        <div>
          <strong>マップ名：</strong>
          {isEditing ? (
            <input
              type="text"
              value={updatedMap?.name || ""}
              onChange={(e) => handleChange(e, "name")}
              className="w-full px-2 py-1 border rounded"
            />
          ) : (
            <span>{map.name}</span>
          )}
        </div>

        {/* 説明 */}
        <div>
          <strong>説明：</strong>
          {isEditing ? (
            <input
              type="text"
              value={updatedMap?.description || ""}
              onChange={(e) => handleChange(e, "description")}
              className="w-full px-2 py-1 border rounded"
            />
          ) : (
            <span>{map.description}</span>
          )}
        </div>

        {/* 編集モードトグル */}
        <div className="flex items-center space-x-2 mt-4">
          <span>編集モード</span>
          <label className="inline-flex relative items-center cursor-pointer w-10 h-6">
            <input
              type="checkbox"
              checked={isEditing}
              onChange={() => setIsEditing(!isEditing)}
              className="sr-only"
            />
            <span
              className={`absolute inset-0 rounded-full transition-colors duration-300 ${
                isEditing ? "bg-green-500" : "bg-gray-300"
              }`}
            ></span>
            <span
              className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ease-in-out ${
                isEditing ? "transform translate-x-4 bg-green-500" : ""
              }`}
            ></span>
          </label>
          <span className="ml-2">{isEditing ? "ON" : "OFF"}</span>
        </div>

        {/* 更新ボタン */}
        {isEditing && (
          <ModalActionButton
            label="更新"
            onClick={handleUpdate}
            icon={<Save className="w-5 h-5" />}
            size="md"
          />
        )}
      </div>
    </BaseModal>
  );
};

export default MapDetailModal;
