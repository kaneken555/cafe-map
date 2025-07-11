// components/GroupCreateModal.tsx
import React, { useState } from "react";
import clsx from "clsx";
import { createGroup } from "../api/group";
import { MODAL_STYLES } from "../constants/ui";  // スタイルをインポート
import CloseModalButton from "./CloseModalButton"; // 共通の閉じるボタンコンポーネント

interface GroupCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void; // 新規作成後のコールバック
}

const GroupCreateModal: React.FC<GroupCreateModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreated 
}) => {
  const [groupName, setGroupName] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setGroupName(""); // 入力内容をリセット
    onClose(); // 親にモーダルを閉じたことを伝える
  };

  const handleCreate = async () => {
    if (!groupName) return;

    const group = await createGroup(groupName);
    if (group) {
      onCreated?.();     // ✅ 親に通知して一覧更新
      setGroupName(""); // 入力リセット
      onClose();        // モーダル閉じる
    }
  };

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

        <h2 className={MODAL_STYLES.SUB_MODAL.TITLE}>新規グループを作成</h2>

        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="グループ名を入力"
          className={MODAL_STYLES.SUB_MODAL.INPUT}
        />

        <button
          className={clsx(
            "w-full py-3 text-black text-lg rounded cursor-pointer",
            groupName
              ? "bg-[#FFC800] hover:bg-[#D8A900]"
              : "bg-gray-300 cursor-not-allowed"
          )}
          disabled={!groupName}
          onClick={handleCreate}
        >
          作成
        </button>
      </div>
    </div>
  );
};

export default GroupCreateModal;
