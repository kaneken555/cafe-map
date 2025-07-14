// components/CafeDetailPanel.tsx
import React from "react";
// import { addCafeToMyCafe } from "../api/cafe";
import CafeDetailCard from "./CafeDetailCard/CafeDetailCard";
import CloseButton from "./CloseButton";
import { Cafe } from "../types/cafe";

import { useMap } from "../contexts/MapContext";
import { useCafe } from "../contexts/CafeContext";
import { useCafeActions } from "../hooks/useCafeActions";

import { toast } from "react-hot-toast";

interface CafeDetailPanelProps {
  cafe: Cafe | null;
  onClose: () => void;
  onAddCafeToMapClick: () => void; // ✅ 親から渡されるモーダル開閉用関数
}

const CafeDetailPanel: React.FC<CafeDetailPanelProps> = ({ 
  cafe, 
  onClose,
  onAddCafeToMapClick, // ✅ 親から渡されるモーダル開閉用関数
}) => {
  
  const { selectedMap } = useMap(); // マップコンテキストからselectedMapを取得
  const { myCafeList, setMyCafeList } = useCafe();
  const { addCafe } = useCafeActions(selectedMap, setMyCafeList);


  const renderCafeDetailCard = () => {
    if (!cafe) return null;
    return (
      <CafeDetailCard
        cafe={cafe}
        // selectedMap={selectedMap}
        myCafeList={myCafeList}
        // setMyCafeList={setMyCafeList}
        onAddClick={handleAddClick} // ✅ ボタン用コールバック追加
        onAddCafe={addCafe} // ✅ 追加
        onShareCafe={() => toast("カフェ共有機能は未実装です")}
      />
    );
  };
  const handleAddClick = () => {
    if (cafe) {
      // TODO: SelectedCafeに追加するか検討
      onAddCafeToMapClick();
    }
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

    </>
  );
};
  
export default CafeDetailPanel;
