// components/MapCreateModal.tsx
import React, { useState } from "react";
import BaseModal from "../BaseModal/BaseModal";
import { MODAL_STYLES } from "../../constants/ui";  // スタイルをインポート
// import { useMapActions } from "../../hooks/useMapActions"; // ✅ 追加


interface MapCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  createMap: (mapName: string, onSuccess: () => void) => void; // ← 外部から注入
}

const MapCreateModal: React.FC<MapCreateModalProps> = ({ 
  isOpen,
  onClose,
  createMap,
}) => {

  // const { createNewMap } = useMapActions(); // ✅ カスタムフックから取得

  const [mapName, setMapName] = useState("");

  // ✅ onCloseとmapNameリセットをまとめた関数
  const handleClose = () => {
    setMapName("");  // 入力内容をリセット
    onClose();       // 親にモーダルを閉じたことを伝える
  };


  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="新規マップを作成" size="sm">
      <input
        type="text"
        placeholder="マップ名を入力"
        className={MODAL_STYLES.SUB_MODAL.INPUT}
        value={mapName}
        onChange={(e) => setMapName(e.target.value)}
      />

      <button 
        className="w-full px-4 py-2 bg-[#FFC800] hover:bg-[#D8A900] cursor-pointer text-black rounded "
        onClick={() => createMap(mapName, handleClose)} // ✅ ここで呼び出し
        >
        作成
      </button>

    </BaseModal>
  );
};

export default MapCreateModal;
