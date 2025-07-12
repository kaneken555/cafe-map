// components/GroupCreateModal.tsx
import React, { useState } from "react";
import clsx from "clsx";
import { createGroup } from "../api/group";
import { MODAL_STYLES } from "../constants/ui";  // スタイルをインポート
import BaseModal from "./BaseModal"; // 共通のモーダルコンポーネント


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
    <BaseModal isOpen={isOpen} onClose={handleClose} title="新規グループを作成" size="sm">

      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="グループ名を入力"
        className={MODAL_STYLES.SUB_MODAL.INPUT}
      />

      <button
        className={clsx(
          "w-full py-2 text-black text-lg rounded cursor-pointer",
          groupName
            ? "bg-[#FFC800] hover:bg-[#D8A900]"
            : "bg-gray-300 cursor-not-allowed"
        )}
        disabled={!groupName}
        onClick={handleCreate}
      >
        作成
      </button>

    </BaseModal>
  );
};

export default GroupCreateModal;
