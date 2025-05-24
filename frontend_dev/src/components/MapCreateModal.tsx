// components/MapCreateModal.tsx
import React, { useState } from "react";
import { createMap } from "../api/map"; 
import { getMapList } from "../api/map";
import { toast } from "react-hot-toast";
import { MapItem } from "../types/map";
import { getGroupMapList, createGroupMap } from "../api/map"; // グループマップ取得API
import { Group } from "../types/group";
import CloseModalButton from "./CloseModalButton";
import { MODAL_STYLES } from "../constants/ui";  // スタイルをインポート


interface MapCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  setMapList: React.Dispatch<React.SetStateAction<MapItem[]>>; 
  selectedGroup: Group | null;
}

const MapCreateModal: React.FC<MapCreateModalProps> = ({ 
  isOpen,
  onClose,
  setMapList,
  selectedGroup, // グループ情報を受け取る
}) => {
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
  
      if (selectedGroup) {
        // ✅ グループマップ作成APIを呼び出す
        await createGroupMap({ name: mapName, groupUuid: selectedGroup.uuid });
        toast.success("グループマップが作成されました");
  
        const maps = await getGroupMapList(selectedGroup.uuid); // グループに紐づくマップ一覧を取得
        setMapList(maps);
        console.log("取得したマップ一覧:", maps);
      } else {
        // ✅ 通常のマップ作成
        await createMap({ name: mapName });
        toast.success("マップが作成されました");
  
        const maps = await getMapList();
        setMapList(maps);
        console.log("取得したマップ一覧:", maps);
      }
  
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
        <CloseModalButton onClose={handleClose} /> {/* ここで共通閉じるボタンを使う */}

        <h2 className={MODAL_STYLES.TITLE}>新規マップを作成</h2>

        <input
          type="text"
          placeholder="マップ名を入力"
          className={MODAL_STYLES.INPUT}
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
