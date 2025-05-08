// components/SearchResultPanel.tsx
import React from "react";
import { Cafe } from "../api/mockCafeData";
import CloseButton from "./CloseButton";
import CafeListItem from "./CafeListItem";

interface SearchResultPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cafes: Cafe[];
  onCafeClick: (cafe: Cafe) => void;
}

const SearchResultPanel: React.FC<SearchResultPanelProps> = ({
  isOpen,
  onClose,
  cafes,
  onCafeClick,
}) => {
  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-[400px] bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-full p-3 relative flex flex-col">
        {/* 閉じるボタン */}
        <div className="p-1">
          <CloseButton onClick={onClose} />
        </div>
        <div className="text-2xl font-bold mb-4">検索結果</div>
        <input
          type="text"
          placeholder="キーワードを入力"
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none"
        />
        {/* 検索結果リスト */}
        <div className="flex-1 overflow-y-auto pr-1">
          {cafes.length === 0 ? (
            <p className="text-gray-500 text-sm">カフェが見つかりませんでした。</p>
          ) : (
            cafes.map((cafe, i) => (
              <CafeListItem key={i} cafe={cafe} onClick={onCafeClick} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultPanel;


