// components/MapListItem.tsx
import React, { useState } from "react";
import { getMapList, deleteMap } from "../api/map";
import MapDeleteModal from "./MapDeleteModal";
import { toast } from "react-hot-toast";
import { CheckCircle, Trash2, Share as ShareIcon } from "lucide-react";
import { MapItem } from "../types/map";


interface MapListItemProps {
  map: MapItem;
  selectedMapId: number | null;
  onSelect: (map: MapItem) => void;
  onClose: () => void;
  setMapList: React.Dispatch<React.SetStateAction<MapItem[]>>;   
  setSelectedMap: (map: MapItem | null) => void;
}
  
const MapListItem: React.FC<MapListItemProps> = ({ 
  map, 
  selectedMapId, 
  onSelect, 
  onClose , 
  setMapList, 
  setSelectedMap,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSelect = () => {
    onSelect(map);
    toast.success(`マップ「${map.name}」を選択しました`);
    onClose();
  };

  const handleDelete = async () => {
    try {
      await deleteMap(map.id);
      const maps = await getMapList();
      setMapList(maps);
      setSelectedMap(null); // マップ削除後に選択マップをリセット
      console.log("取得したマップ一覧:", maps); // 開発用ログ
      toast.success(`マップ「${map.name}」を削除しました`);
    } catch (error) {
      console.error("マップ削除エラー:", error);
      toast.error("マップの削除に失敗しました");
    }
  };

  const handleShare = () => {
    toast("マップ共有機能は未実装です");
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
          <div className="w-12 flex flex-col items-center text-green-600">
            <CheckCircle size={24} />
            <span className="text-sm">選択中</span>
          </div>
        ) : (
          <button
            onClick={handleSelect}
            className="w-12 flex flex-col items-center text-gray-700 hover:text-blue-500 cursor-pointer"
          >
            <CheckCircle size={24} />
            <span className="text-sm">選択</span>
          </button>
        )}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-12 flex flex-col items-center text-gray-700 hover:text-red-500 cursor-pointer"
          >
            <Trash2 size={24} />  {/* ゴミ箱アイコン */}
            <span className="text-sm">Delete</span>
          </button>
          <button
            onClick={handleShare}
            className="w-12 flex flex-col items-center text-gray-700 hover:text-blue-500 cursor-pointer"
          >
            <ShareIcon size={24} /> {/* シェアアイコン */}
            <span className="text-sm">Share</span>
          </button>
        </div>
      </li>
    </>
  );
};
  
export default MapListItem;
  