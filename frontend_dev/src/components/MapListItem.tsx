// components/MapListItem.tsx
import React, { useState } from "react";
import { getMapList, deleteMap } from "../api/map";
import MapDeleteModal from "./MapDeleteModal";

interface MapListItemProps {
  map: { id: number; name: string };
  selectedMapId: number | null;
  onSelect: (map: { id: number; name: string }) => void;
  onClose: () => void;
  setMapList: React.Dispatch<React.SetStateAction<{ id: number; name: string }[]>>;   
}
  
const MapListItem: React.FC<MapListItemProps> = ({ map, selectedMapId, onSelect, onClose , setMapList }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSelect = () => {
    onSelect(map);
    onClose();
  };

  const handleDelete = async () => {
    try {
      await deleteMap(map.id);
      const maps = await getMapList();
      setMapList(maps);
      console.log("取得したマップ一覧:", maps); // 開発用コメント
    } catch (error) {
      console.error("マップ削除エラー:", error);
      alert("マップの削除に失敗しました。");
    }
  };

  const handleShare = () => {
    alert("マップ共有機能は未実装です");
  };

  return (
    <>
      {/* モーダル呼び出し */}
      <MapDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={async () => {
          await handleDelete();
          setIsDeleteModalOpen(false);
        }}
        mapName={map.name}
      />

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
          <button 
            className="text-sm text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            削除
          </button>
          <button 
            className="text-sm text-white bg-gray-500 hover:bg-gray-600 px-2 py-1 rounded"
            onClick={handleShare}
          >
            共有
          </button>
        </div>
      </li>
    </>
  );
};
  
export default MapListItem;
  