// components/CafeDetailPanel.tsx
import React, { useState, useRef, useEffect } from "react";
// import { addCafeToMyCafe } from "../api/cafe";
import CafeDetailCard from "../CafeDetailCard/CafeDetailCard";
import CloseButton from "../CloseButton/CloseButton";
import BottomSheetHandle from "../BottomSheetHandle/BottomSheetHandle";
import { Cafe } from "../../types/cafe";

import { useMap } from "../../contexts/MapContext";
import { useCafe } from "../../contexts/CafeContext";
import { useCafeActions } from "../../hooks/useCafeActions";
import { useIsMobile } from "../../hooks/useMediaQuery";

import { toast } from "react-hot-toast";

type SheetHeight = "medium" | "full";

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
  const { toggleCafe } = useCafeActions(selectedMap, setMyCafeList);
  const isMobile = useIsMobile();

  // Bottom Sheet state
  const [sheetHeight, setSheetHeight] = useState<SheetHeight>("medium");
  // const [isDragging, setIsDragging] = useState(false);
  // const [startY, setStartY] = useState(0);
  // const [currentY, setCurrentY] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // Reset to medium when cafe changes
  useEffect(() => {
    if (cafe) {
      setSheetHeight("medium");
    }
  }, [cafe]);


  // Handle bar tap handler
  const handleHandleBarClick = () => {
    if (!isMobile) return;

    if (sheetHeight === "medium") {
      setSheetHeight("full");
    } else {
      setSheetHeight("medium");
    }
  };

  // Touch event handlers for swipe gesture (currently disabled)
  // const handleTouchStart = (e: React.TouchEvent) => {
  //   if (!isMobile) return;
  //   setIsDragging(true);
  //   setStartY(e.touches[0].clientY);
  //   setCurrentY(e.touches[0].clientY);
  // };

  // const handleTouchMove = (e: React.TouchEvent) => {
  //   if (!isMobile || !isDragging) return;
  //   setCurrentY(e.touches[0].clientY);
  // };

  // const handleTouchEnd = () => {
  //   if (!isMobile || !isDragging) return;
  //   setIsDragging(false);

  //   const deltaY = currentY - startY;
  //   const threshold = 50; // Minimum swipe distance

  //   if (deltaY > threshold) {
  //     // Swipe down
  //     if (sheetHeight === "full") {
  //       setSheetHeight("medium");
  //     } else {
  //       onClose();
  //     }
  //   } else if (deltaY < -threshold) {
  //     // Swipe up
  //     if (sheetHeight === "medium") {
  //       setSheetHeight("full");
  //     }
  //   }

  //   setStartY(0);
  //   setCurrentY(0);
  // };

  const renderCafeDetailCard = () => {
    if (!cafe) return null;

    const isRegistered = myCafeList.some((c) => c.placeId === cafe.placeId);

    return (
      <CafeDetailCard
        cafe={cafe}
        // selectedMap={selectedMap}
        myCafeList={myCafeList}
        // setMyCafeList={setMyCafeList}
        onAddClick={handleAddClick} // ✅ ボタン用コールバック追加
        onAddCafe={() => toggleCafe(cafe, isRegistered)}
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


  // Calculate the dynamic translate value while dragging (currently disabled)
  // const getDragOffset = () => {
  //   if (!isDragging || !isMobile) return 0;
  //   const deltaY = currentY - startY;
  //   return Math.max(0, deltaY); // Only allow dragging down
  // };

  const getHeightClass = () => {
    if (!isMobile) return "h-[calc(100vh-4rem)]";
    return sheetHeight === "full" ? "h-[85vh]" : "h-[40vh]";
  };

  return (
    <>
      {/* Background overlay for mobile (click to close, but not darkened) */}
      {isMobile && cafe && (
        <div
          className="fixed inset-0 z-45"
          onClick={onClose}
        />
      )}

      {/* Panel/Bottom Sheet */}
      <div
        ref={panelRef}
        className={`
          fixed bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
          ${isMobile
            ? `bottom-0 left-0 right-0 rounded-t-2xl ${getHeightClass()} ${
                cafe ? "translate-y-0" : "translate-y-full"
              }`
            : `left-0 top-16 h-[calc(100vh-4rem)] w-[400px] ${
                cafe ? "translate-x-0" : "-translate-x-full"
              }`
          }
        `}
      >
        {isMobile ? (
          <>
            {/* Handle bar for mobile */}
            <BottomSheetHandle
              onClick={handleHandleBarClick}
              state={sheetHeight}
            />
            <div className="overflow-y-auto h-[calc(100%-2rem)] px-4">
              {renderCafeDetailCard()}
            </div>
          </>
        ) : (
          <>
            {/* Close button for desktop */}
            <div className="p-2">
              <CloseButton onClick={onClose} />
            </div>
            {renderCafeDetailCard()}
          </>
        )}
      </div>
    </>
  );
};
  
export default CafeDetailPanel;
