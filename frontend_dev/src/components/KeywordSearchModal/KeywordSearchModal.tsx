// components/KeywordSearchModal.tsx
import React, { useState } from "react";
import BaseModal from "../BaseModal/BaseModal"; // 共通のモーダルコンポーネント
import ModalActionButton from "../ModalActionButton/ModalActionButton";
import { Search } from "lucide-react"; // 任意のアイコン

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

      <ModalActionButton
        label="検索"
        onClick={handleSearch}
        icon={<Search className="w-5 h-5" />}
        size="md"
      />

    </BaseModal>
  );
};

export default KeywordSearchModal;
