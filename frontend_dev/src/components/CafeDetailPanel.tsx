// components/CafeDetailPanel.tsx
import React from "react";
import CafeDetailCard from "./CafeDetailCard";
import CloseButton from "./CloseButton";
import { Cafe } from "../types/cafe";

import { useMap } from "../contexts/MapContext";
import { useCafe } from "../contexts/CafeContext";

interface CafeDetailPanelProps {
  cafe: Cafe | null;
  onClose: () => void;
}

const CafeDetailPanel: React.FC<CafeDetailPanelProps> = ({ 
  cafe, 
  onClose, 
}) => {
  const { selectedMap } = useMap(); // マップコンテキストからselectedMapを取得
  const { myCafeList, setMyCafeList } = useCafe();

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
      className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] w-[400px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40
        ${cafe ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="p-1">
        <CloseButton onClick={onClose} />
      </div>

      {renderCafeDetailCard()}
    </div>
  );
};
  

export default CafeDetailPanel;
