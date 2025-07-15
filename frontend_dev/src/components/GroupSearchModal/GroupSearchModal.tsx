// components/GroupJoinModal.tsx
import React, { useState } from "react";
import BaseModal from "../BaseModal/BaseModal";
import ModalActionButton from "./../ModalActionButton/ModalActionButton";


interface GroupSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (input: string) => void;
}

const GroupSearchModal: React.FC<GroupSearchModalProps> = ({ 
  isOpen, 
  onClose, 
  onSearch 
}) => {
  const [input, setInput] = useState("");


  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="グループ参加" size="md">

      <p className="text-sm text-gray-700 mb-2">参加コードまたはURLを入力してください</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border px-2 py-1 rounded mb-4"
        placeholder="https://example.com/invite/xxxxx"
      />

      <ModalActionButton
        label="検索"
        onClick={() => onSearch(input)}
        size="md" // ← BaseModalと同じサイズを渡す
      />

    </BaseModal>
  );
};

export default GroupSearchModal;

