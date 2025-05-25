// components/SharedMapRegisterModal.tsx
import React, { useState } from "react";
import CloseModalButton from "./CloseModalButton";
import { MapItem, SharedMapItem } from "../types/map";
import { getMapList, copySharedMap } from "../api/map";
import toast from "react-hot-toast";
import { MODAL_STYLES } from "../constants/ui";


interface SharedMapRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMapName: string;
  map: SharedMapItem,
  setMapList: React.Dispatch<React.SetStateAction<MapItem[]>>;
}

const SharedMapRegisterModal: React.FC<SharedMapRegisterModalProps> = ({
  isOpen,
  onClose,
  initialMapName,
  map,
  setMapList,
}) => {
  const [mapName, setMapName] = useState(initialMapName);

  if (!isOpen) return null;

  const handleClose = () => {
    setMapName(initialMapName); // 初期化
    onClose();
  };


  const handleRegister = async () => {
    if (!mapName.trim()) return;
  
    try {
      // setMapName(initialMapName);
      console.log("マップ名:", mapName);
      console.log("マップ情報:", map);
      await copySharedMap(map.uuid, mapName.trim());
      toast.success(`マップ「${mapName}」をマイマップとして登録しました`);

      const maps = await getMapList();              // ✅ マップ一覧を再取得
      setMapList(maps);                            // ✅ マップ一覧を更新

      onClose();
    } catch (error) {
      console.error("マイマップ登録に失敗:", error);
    }
  };

  return (
    <div
      className={MODAL_STYLES.SUB_MODAL.CONTAINER}
      onClick={handleClose}
    >
      <div
        className="bg-[#fffaf0] w-[400px] p-6 rounded-lg shadow-md relative"
        onClick={(e) => e.stopPropagation()}
      >

        <CloseModalButton onClose={handleClose} /> {/* ここで共通閉じるボタンを使う */}

        <h2 className={MODAL_STYLES.SUB_MODAL.TITLE}>マイマップ登録</h2>

        <input
          type="text"
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
          placeholder="シェアマップ名"
          className="w-full px-4 py-2 border rounded mb-4 text-gray-700"
        />

        <button
          onClick={handleRegister}
          className={`w-full px-4 py-2 text-black text-lg rounded cursor-pointer ${
            mapName.trim() ? "bg-[#FFC800] hover:bg-[#D8A900]" : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!mapName.trim()}
        >
          登録
        </button>
      </div>
    </div>
  );
};

export default SharedMapRegisterModal;
