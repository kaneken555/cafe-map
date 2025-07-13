// components/GroupJoinModal.tsx
import React, { useState } from "react";
import BaseModal from "./BaseModal/BaseModal";


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
      <button
        onClick={() => onSearch(input)}
        className="w-full py-2 bg-[#FFC800] hover:bg-[#D8A900] text-black rounded font-medium cursor-pointer"
      >
        検索
      </button>

    </BaseModal>
  );
};

export default GroupSearchModal;

