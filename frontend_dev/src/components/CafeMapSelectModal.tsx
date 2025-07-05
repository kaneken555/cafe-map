// components/CafeMapSelectModal.tsx
import React, { useEffect, useState } from "react";
import { MapIcon } from "lucide-react";
import { MapItem } from "../types/map";
import { useMap } from "../contexts/MapContext";
import { toast } from "react-hot-toast";
import BaseModal from "./BaseModal";

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


  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="カフェを追加するマップを選択してください"
      icon={<MapIcon className="w-6 h-6 text-[#6b4226]" />}
      size="lg"
    >

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
        
    </BaseModal>
  );
};

export default CafeMapSelectModal;
