// components/KeywordSearchModal.tsx
import React, { useState } from "react";
import CloseModalButton from "./CloseModalButton"; // 共通の閉じるボタンコンポーネント
import { MODAL_STYLES } from "../constants/ui";

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
    <div className={MODAL_STYLES.MAIN_MODAL.CONTAINER}>
      <div className="bg-[#fffaf0] p-6 rounded-lg w-[400px] shadow-md relative">

        <CloseModalButton onClose={onClose} /> {/* ここで共通閉じるボタンを使う */}

        <h2 className={MODAL_STYLES.MAIN_MODAL.TITLE}>キーワード検索</h2>
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
      </div>
    </div>
  );
};

export default KeywordSearchModal;
