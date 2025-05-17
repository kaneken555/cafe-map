// components/MapCreateModal.tsx
import React, { useState } from "react";
import { createMap } from "../api/map"; 
import { getMapList } from "../api/map";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import { MapItem } from "../types/map";


interface MapCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  setMapList: React.Dispatch<React.SetStateAction<MapItem[]>>; 
}

const MapCreateModal: React.FC<MapCreateModalProps> = ({ isOpen, onClose, setMapList }) => {
  const [mapName, setMapName] = useState("");

  // ✅ onCloseとmapNameリセットをまとめた関数
  const handleClose = () => {
    setMapName("");  // 入力内容をリセット
    onClose();       // 親にモーダルを閉じたことを伝える
  };

  const handleCreateMap = async () => {
    try {
      if (mapName.trim() === "") {
        toast.error("マップ名を入力してください");
        return;
      }
  
      await createMap({ name: mapName }); // ✅ マップ作成
      toast.success("マップが作成されました");

      const maps = await getMapList(); // ✅ 最新のマップリスト取得
      setMapList(maps); // ✅ 親コンポーネントにマップリストを渡す
      console.log("取得したマップ一覧:", maps);
  
      handleClose(); // ✅ モーダル閉じる
    } catch (error) {
      console.error("マップ作成エラー:", error);
      toast.error("マップ作成に失敗しました");
    }
  };
  

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-center items-center z-60"
      onClick={handleClose}
    >
      <div
        className="bg-[#fffaf0] w-96 max-w-full rounded-lg p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-3 text-lg font-bold text-[#6b4226] hover:text-black cursor-pointer"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4 text-[#6b4226]">新規マップを作成</h2>

        <input
          type="text"
          placeholder="マップ名を入力"
          className="w-full px-4 py-2 border rounded mb-4"
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
        />

        <button 
          className="w-full px-4 py-2 bg-[#FFC800] hover:bg-[#D8A900] cursor-pointer text-black rounded "
          onClick={handleCreateMap}
          >
          作成
        </button>
      </div>
    </div>
  );
};

export default MapCreateModal;
