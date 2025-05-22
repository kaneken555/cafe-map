// components/GroupJoinModal.tsx
import React, { useState } from "react";
import { X } from "lucide-react";

interface GroupSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (input: string) => void;
}

const GroupSearchModal: React.FC<GroupSearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-60">
      <div className="bg-[#fffaf0] w-[400px] p-6 rounded-lg shadow-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#6b4226] hover:text-black"
        >
          <X size={24} />
        </button>
        <h2 className="text-lg font-bold text-[#6b4226] mb-4">グループ参加</h2>
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
          className="w-full py-2 bg-[#FFC800] hover:bg-[#D8A900] text-black rounded font-medium"
        >
          検索
        </button>
      </div>
    </div>
  );
};

export default GroupSearchModal;

