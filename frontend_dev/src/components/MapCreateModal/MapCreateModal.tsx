// components/MapCreateModal.tsx
import React, { useState } from "react";
import BaseModal from "../BaseModal/BaseModal";
import { MODAL_STYLES } from "../../constants/ui";  // スタイルをインポート
import ModalActionButton from "./../ModalActionButton/ModalActionButton";
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

      <ModalActionButton
        label="作成"
        onClick={() => createMap(mapName, handleClose)}
        size="sm"
      />

    </BaseModal>
  );
};

export default MapCreateModal;
