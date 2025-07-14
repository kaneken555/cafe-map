// components/SearchResultPanel.tsx
import React from "react";
import CafeListItem from "../CafeListItem/CafeListItem";
import SidePanelLayout from "../SidePanelLayout/SidePanelLayout";
import { Cafe } from "../../types/cafe";


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
    <SidePanelLayout isOpen={isOpen} onClose={onClose} title="検索結果">
      <input
        type="text"
        placeholder="キーワードを入力"
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none"
      />
      <div className="flex-1 overflow-y-auto pr-1">
        {cafes.length === 0 ? (
          <p className="text-gray-500 text-sm">カフェが見つかりませんでした。</p>
        ) : (
          cafes.map((cafe, i) => <CafeListItem key={i} cafe={cafe} onClick={onCafeClick} />)
        )}
      </div>
    </SidePanelLayout>
  );
};

export default SearchResultPanel;


