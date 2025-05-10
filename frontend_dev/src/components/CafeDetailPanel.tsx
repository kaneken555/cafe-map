// components/CafeDetailPanel.tsx
import React from "react";
import CafeDetailCard from "./CafeDetailCard";
import CloseButton from "./CloseButton";
import { Cafe } from "../api/mockCafeData"; // 👈 Cafe 型を import
import { MapItem } from "../types/map"; // ← 共通型をインポート


interface CafeDetailPanelProps {
  cafe: Cafe | null;
  onClose: () => void;
  selectedMap: MapItem | null;
  myCafeList: Cafe[];
  setMyCafeList: React.Dispatch<React.SetStateAction<Cafe[]>>; 
}

const CafeDetailPanel: React.FC<CafeDetailPanelProps> = ({ cafe, onClose, selectedMap, myCafeList, setMyCafeList }) => {
  const renderCafeDetailCard = () => {
    if (!cafe) return null;
    return (
      <CafeDetailCard
        cafe={cafe}
        selectedMap={selectedMap}
        myCafeList={myCafeList}
        setMyCafeList={setMyCafeList}
      />
    );
  };

  return (
    <div
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-[400px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40
        ${cafe ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="p-1">
        <CloseButton onClick={onClose} />
      </div>

      {renderCafeDetailCard()}
    </div>
  );
};
  

export default CafeDetailPanel;
