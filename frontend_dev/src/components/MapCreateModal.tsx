// components/MapCreateModal.tsx
import React, { useState } from "react";
import { createMap } from "../api/map"; 
import { getMapList } from "../api/map";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  setMapList: React.Dispatch<React.SetStateAction<{ id: number; name: string }[]>>; 
}

const MapCreateModal: React.FC<Props> = ({ isOpen, onClose, setMapList }) => {
  const [mapName, setMapName] = useState(""); // ✅ 入力値を管理

  // ✅ onCloseとmapNameリセットをまとめた関数
  const handleClose = () => {
    setMapName("");  // 入力内容をリセット
    onClose();       // 親にモーダルを閉じたことを伝える
  };

  const handleCreateMap = async () => {
    try {
      if (mapName.trim() === "") {
        alert("マップ名を入力してください");
        return;
      }
  
      await createMap({ name: mapName }); // ✅ マップ作成
      alert("マップが作成されました");
  
      const maps = await getMapList(); // ✅ 最新のマップリスト取得
      setMapList(maps); // ✅ 親コンポーネントにマップリストを渡す
      console.log("取得したマップ一覧:", maps);
  
      handleClose(); // ✅ モーダル閉じる
    } catch (error) {
      console.error("マップ作成エラー:", error);
      alert("マップ作成に失敗しました");
    }
  };
  

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex justify-center items-center z-60"
      onClick={handleClose}
    >
      <div
        className="bg-white w-96 max-w-full rounded-lg p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-3 text-lg font-bold text-gray-600 hover:text-black"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">新規マップを作成</h2>

        {/* 仮の入力フィールド */}
        <input
          type="text"
          placeholder="マップ名を入力"
          className="w-full px-4 py-2 border rounded mb-4"
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
        />

        <button 
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleCreateMap} // ✅ マップ作成関数を呼び出す
          >
          作成
        </button>
      </div>
    </div>
  );
};

export default MapCreateModal;
