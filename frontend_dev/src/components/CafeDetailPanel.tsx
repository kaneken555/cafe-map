// components/CafeDetailPanel.tsx
import React, { useState } from "react";
import { addCafeToMyCafe } from "../api/cafe";
import CafeDetailCard from "./CafeDetailCard";
import CloseButton from "./CloseButton";
import CafeMapSelectModal from "./CafeMapSelectModal"; // ✅ 追加
import { Cafe } from "../types/cafe";
import { MapItem } from "../types/map";

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
  const [isCafeMapSelectModalOpen, setIsCafeMapSelectModalOpen] = useState(false); // ✅ モーダル開閉
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null); // ✅ 選択中カフェ


  const renderCafeDetailCard = () => {
    if (!cafe) return null;
    return (
      <CafeDetailCard
        cafe={cafe}
        selectedMap={selectedMap}
        myCafeList={myCafeList}
        setMyCafeList={setMyCafeList}
        onAddClick={handleAddClick} // ✅ ボタン用コールバック追加
      />
    );
  };
  const handleAddClick = () => {
    if (cafe) {
      // TODO: SelectedCafeに追加するか検討
      setSelectedCafe(cafe);
      setIsCafeMapSelectModalOpen(true);
    }
  };

  const handleAddToMaps = (maps: MapItem[]) => {
    if (!selectedCafe) return;
    maps.forEach((map) => {
      addCafeToMyCafe(map.id, selectedCafe)
      console.log(`カフェ「${selectedCafe.name}」をマップ「${map.name}」に追加`);
    });
    // TODO: MyCafeListに追加するか検討
    setMyCafeList((prev) => {
      const isAlready = prev.some((c) => c.placeId === selectedCafe.placeId);
      return isAlready ? prev : [...prev, selectedCafe];
    });    
  };

  return (
    <>
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

      <CafeMapSelectModal
        isOpen={isCafeMapSelectModalOpen}
        onClose={() => setIsCafeMapSelectModalOpen(false)}
        initialSelectedMap={selectedMap}
        onAdd={handleAddToMaps}
      />
    </>
  );
};
  
export default CafeDetailPanel;
