// components/MapCreateModal.tsx
import React, { useState } from "react";
import { createMap } from "../api/map"; 
import { getMapList } from "../api/map";
import { toast } from "react-hot-toast";
import { getGroupMapList, createGroupMap } from "../api/map"; // グループマップ取得API
import CloseModalButton from "./CloseModalButton";
import { MODAL_STYLES } from "../constants/ui";  // スタイルをインポート

import { useMap } from "../contexts/MapContext"; // マップコンテキストをインポート
import { useGroup } from "../contexts/GroupContext"; // グループコンテキストをインポート

interface MapCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MapCreateModal: React.FC<MapCreateModalProps> = ({ 
  isOpen,
  onClose,
}) => {
  const { setMapList } = useMap(); // マップリストのセット関数をコンテキストから取得
  const { selectedGroup } = useGroup(); // グループリストのセット関数をコンテキストから取得

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
      className={MODAL_STYLES.SUB_MODAL.CONTAINER}
      onClick={handleClose}
    >
      <div
        className="bg-[#fffaf0] w-96 max-w-full rounded-lg p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <CloseModalButton onClose={handleClose} /> {/* ここで共通閉じるボタンを使う */}

        <h2 className={MODAL_STYLES.SUB_MODAL.TITLE}>新規マップを作成</h2>

        <input
          type="text"
          placeholder="マップ名を入力"
          className={MODAL_STYLES.SUB_MODAL.INPUT}
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
