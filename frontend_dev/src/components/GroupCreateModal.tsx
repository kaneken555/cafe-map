// components/GroupCreateModal.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { createGroup } from "../api/group";


interface GroupCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void; // 新規作成後のコールバック
}

const GroupCreateModal: React.FC<GroupCreateModalProps> = ({ isOpen, onClose, onCreated }) => {
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
      className="fixed inset-0 bg-black/30 flex justify-center items-center z-60"
      onClick={handleClose} 
    >
      <div
        className="bg-[#fffaf0] w-96 max-w-full rounded-lg p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-[#6b4226] hover:text-black cursor-pointer"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-[#6b4226] mb-4">新規グループを作成</h2>

        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="グループ名を入力"
          className="w-full px-4 py-2 border rounded mb-4"
        />

        <button
          className={`w-full py-3 text-black text-lg rounded cursor-pointer ${
            groupName ? "bg-[#FFC800] hover:bg-[#D8A900]" : "bg-gray-300 cursor-not-allowed"
          }`}
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
