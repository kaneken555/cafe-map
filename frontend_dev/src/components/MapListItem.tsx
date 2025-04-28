// components/MapListItem.tsx
import React from "react";

interface MapListItemProps {
  map: { id: number; name: string };
  selectedMapId: number | null;
  onSelect: (map: { id: number; name: string }) => void;
  onClose: () => void;
}
  
const MapListItem: React.FC<MapListItemProps> = ({ map, selectedMapId, onSelect, onClose }) => {
  const handleSelect = () => {
    onSelect(map);
    onClose();
  };

  return (
    <li className="flex justify-between items-center border px-4 py-2 rounded">
      <span className="truncate">{map.name}</span>
      <div className="flex space-x-2">
        {map.id === selectedMapId ? (
          <span className="text-sm text-white bg-green-500 px-2 py-1 rounded">
            選択中
          </span>
        ) : (
          <button
            className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
            onClick={handleSelect}
          >
            選択
          </button>
        )}
        <button className="text-sm text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded">
          削除
        </button>
        <button className="text-sm text-white bg-gray-500 hover:bg-gray-600 px-2 py-1 rounded">
          共有
        </button>
      </div>
    </li>
  );
};
  
export default MapListItem;
  