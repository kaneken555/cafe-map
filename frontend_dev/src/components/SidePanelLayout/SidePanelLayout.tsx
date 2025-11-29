// components/SidePanelLayout.tsx
import React, { useState, useEffect, useRef } from "react";
import CloseButton from "../CloseButton/CloseButton";
import BottomSheetHandle from "../BottomSheetHandle/BottomSheetHandle";
import { useIsMobile } from "../../hooks/useMediaQuery";

type SheetHeight = "medium" | "full";


interface SidePanelLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const SidePanelLayout: React.FC<SidePanelLayoutProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const isMobile = useIsMobile();

  // Bottom Sheet state
  const [sheetHeight, setSheetHeight] = useState<SheetHeight>("medium");
  const panelRef = useRef<HTMLDivElement>(null);

  // Reset to medium when panel opens
  useEffect(() => {
    if (isOpen) {
      setSheetHeight("medium");
    }
  }, [isOpen]);

  // Handle bar tap handler
  const handleHandleBarClick = () => {
    if (!isMobile) return;

    if (sheetHeight === "medium") {
      setSheetHeight("full");
    } else {
      setSheetHeight("medium");
    }
  };

  const getHeightClass = () => {
    if (!isMobile) return "h-[calc(100vh-4rem)]";
    return sheetHeight === "full" ? "h-[90vh]" : "h-[40vh]";
  };

  return (
    <>
      {/* Background overlay for mobile (click to close, but not darkened) */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 z-45" onClick={onClose} />
      )}

      {/* Panel/Bottom Sheet */}
      <div
        ref={panelRef}
        className={`
          fixed bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
          ${isMobile
            ? `bottom-0 left-0 right-0 rounded-t-2xl ${getHeightClass()} ${
                isOpen ? "translate-y-0" : "translate-y-full"
              }`
            : `left-0 top-16 h-[calc(100vh-4rem)] w-[400px] ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              }`
          }
        `}
      >
        {isMobile ? (
          <div className="flex flex-col h-full">
            {/* Mobile: Handle bar */}
            <BottomSheetHandle
              onClick={handleHandleBarClick}
              state={sheetHeight}
            />
            <div className="px-3 pb-3 flex-1 flex flex-col overflow-hidden">
              <div className="text-2xl font-bold mb-4">{title}</div>
              <div className="flex-1 overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop: Close button */}
            <div className="h-full p-3 relative flex flex-col">
              <CloseButton onClick={onClose} />
              <div className="text-2xl font-bold mb-4">{title}</div>
              {children}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SidePanelLayout;

