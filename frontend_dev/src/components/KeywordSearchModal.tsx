// components/KeywordSearchModal.tsx
import React, { useState } from "react";
import BaseModal from "./BaseModal/BaseModal"; // 共通のモーダルコンポーネント


interface Props {
  onClose: () => void;
  onSearch: (keyword: string) => void;
}

const KeywordSearchModal: React.FC<Props> = ({ 
  onClose, 
  onSearch,
}) => {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (!keyword.trim()) return;
    onSearch(keyword.trim());
  };

  return (
    <BaseModal isOpen={true} onClose={onClose} title="キーワード検索" size="md">

      <input
        type="text"
        placeholder="カフェ名や地名など"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-4"
      />
      <button
        onClick={handleSearch}
        className="w-full bg-[#FFC800] text-black py-2 rounded hover:bg-[#D8A900] cursor-pointer"
      >
        検索
      </button>

    </BaseModal>
  );
};

export default KeywordSearchModal;
