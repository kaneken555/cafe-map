// components/CafeMapSelectModal.tsx
import React, { useEffect, useState } from "react";
import CloseModalButton from "./CloseModalButton";
import { MapItem } from "../types/map";
import { useMap } from "../contexts/MapContext";
import { toast } from "react-hot-toast";
import { MODAL_STYLES } from "../constants/ui";

interface CafeMapSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedMap: MapItem | null;
  onAdd: (selectedMaps: MapItem[]) => void;
}

const CafeMapSelectModal: React.FC<CafeMapSelectModalProps> = ({
  isOpen,
  onClose,
  initialSelectedMap,
  onAdd,
}) => {
  const { mapList } = useMap();
  const [selectedMaps, setSelectedMaps] = useState<MapItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (initialSelectedMap) {
        setSelectedMaps([initialSelectedMap]);
      } else {
        setSelectedMaps([]);
      }
    }
  }, [isOpen, initialSelectedMap]);

  const toggleMapSelection = (map: MapItem) => {
    setSelectedMaps((prev) =>
      prev.some((m) => m.id === map.id)
        ? prev.filter((m) => m.id !== map.id)
        : [...prev, map]
    );
  };

  const handleAdd = () => {
    if (selectedMaps.length === 0) {
      toast.error("マップを1つ以上選択してください");
      return;
    }

    onAdd(selectedMaps);
    toast.success("カフェをマップに追加しました");
    onClose();
    setSelectedMaps([]);
  };

  if (!isOpen) return null;

  return (
    <div className={MODAL_STYLES.MAIN_MODAL.CONTAINER} onClick={onClose}>
      <div
        className="bg-[#fffaf0] w-[700px] max-w-full rounded-lg p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <CloseModalButton onClose={onClose} />

        <h2 className="text-xl font-bold text-[#6b4226] mb-4">
          カフェを追加するマップを選択してください
        </h2>

        <ul className="space-y-2 mb-6 max-h-[400px] overflow-y-auto">
          {mapList.map((map) => {
            const isSelected = selectedMaps.some((m) => m.id === map.id);
            return (
              <li
                key={map.id}
                className={`flex justify-between items-center p-2 border rounded cursor-pointer ${
                  isSelected ? "bg-green-100" : "hover:bg-gray-100"
                }`}
                onClick={() => toggleMapSelection(map)}
              >
                <span>{map.name}</span>
                {isSelected && <span>✅</span>}
              </li>
            );
          })}
        </ul>

        <button
          className="w-full px-4 py-2 bg-[#FFC800] hover:bg-[#D8A900] text-black rounded cursor-pointer"
          onClick={handleAdd}
        >
          追加
        </button>
      </div>
    </div>
  );
};

export default CafeMapSelectModal;
