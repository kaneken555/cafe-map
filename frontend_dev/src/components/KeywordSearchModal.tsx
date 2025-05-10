// components/KeywordSearchModal.tsx
import React, { useState } from "react";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  onSearch: (keyword: string) => void;
}

const KeywordSearchModal: React.FC<Props> = ({ onClose, onSearch }) => {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (!keyword.trim()) return;
    onSearch(keyword.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-md relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 cursor-pointer">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">キーワード検索</h2>
        <input
          type="text"
          placeholder="カフェ名や地名など"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          検索
        </button>
      </div>
    </div>
  );
};

export default KeywordSearchModal;
