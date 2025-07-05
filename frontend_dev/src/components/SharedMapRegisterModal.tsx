// components/SharedMapRegisterModal.tsx
import React, { useState } from "react";
import BaseModal from "./BaseModal";
import { SharedMapItem } from "../types/map";
import { getMapList, copySharedMap } from "../api/map";
import toast from "react-hot-toast";

import { useMap } from "../contexts/MapContext"; // マップコンテキストをインポート


interface SharedMapRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMapName: string;
  map: SharedMapItem,
}

const SharedMapRegisterModal: React.FC<SharedMapRegisterModalProps> = ({
  isOpen,
  onClose,
  initialMapName,
  map,
}) => {
  const { setMapList } = useMap(); // マップリストのセット関数をコンテキストから取得

  const [mapName, setMapName] = useState(initialMapName);

  const handleClose = () => {
    setMapName(initialMapName); // 初期化
    onClose();
  };


  const handleRegister = async () => {
    if (!mapName.trim()) return;
  
    try {
      console.log("マップ名:", mapName);
      console.log("マップ情報:", map);
      await copySharedMap(map.uuid, mapName.trim());
      toast.success(`マップ「${mapName}」をマイマップとして登録しました`);

      const maps = await getMapList();
      setMapList(maps);

      onClose();
    } catch (error) {
      console.error("マイマップ登録に失敗:", error);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="マイマップ登録" size="md">

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

    </BaseModal>
  );
};

export default SharedMapRegisterModal;
