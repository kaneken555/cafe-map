// components/SidePanelLayout.tsx
import React from "react";
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
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-[400px] bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
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

