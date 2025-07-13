// components/MyCafeListPanel.tsx
import React from "react";
import CafeListItem from "../CafeListItem";
import SidePanelLayout from "../SidePanelLayout";
import { Cafe } from "../../types/cafe";


interface MyCafeListPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cafes: Cafe[];
  onCafeClick: (cafe: Cafe) => void;
}


const MyCafeListPanel: React.FC<MyCafeListPanelProps> = ({ 
  isOpen, 
  onClose, 
  cafes, 
  onCafeClick, 
}) => {
  return (
    <SidePanelLayout isOpen={isOpen} onClose={onClose} title="My Café List">
      <input
        type="text"
        placeholder="キーワードを入力"
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none"
      />
      <div className="flex-1 overflow-y-auto pr-1">
        {cafes.length === 0 ? (
          <p className="text-gray-500 text-sm">このマップにカフェは登録されていません。</p>
        ) : (
          cafes.map((cafe, i) => <CafeListItem key={i} cafe={cafe} onClick={onCafeClick} />)
        )}
      </div>
    </SidePanelLayout>
  );
};

export default MyCafeListPanel;
