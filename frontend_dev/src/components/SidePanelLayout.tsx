// components/SidePanelLayout.tsx
import React from "react";
import clsx from "clsx";
import CloseButton from "./CloseButton";


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
  return (
    <div
      className={clsx(
        "fixed top-16 left-0 z-40 w-[400px] h-[calc(100vh-4rem)]",
        "bg-white shadow-lg",
        "transform transition-transform duration-300 ease-in-out",
        {
          "translate-x-0": isOpen,
          "-translate-x-full": !isOpen,
        }
      )}
    >
      <div className="h-full p-3 relative flex flex-col">
        {/* 閉じるボタン（右上） */}
        <CloseButton onClick={onClose} />

        {/* タイトル */}
        <div className="text-2xl font-bold mb-4">{title}</div>

        {/* 子要素（検索バーやリストなど） */}
        {children}
      </div>
    </div>
  );
};

export default SidePanelLayout;

