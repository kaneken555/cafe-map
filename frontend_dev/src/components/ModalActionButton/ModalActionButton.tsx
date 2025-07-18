// components/ModalActionButton.tsx
import React from "react";

type ModalSize = "lg" | "md" | "sm"; // BaseModalと合わせる


interface ModalActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode; // オプションでアイコンも渡せる
  size?: ModalSize; // 追加
}

const SIZE_CLASS_MAP: Record<ModalSize, string> = {
  lg: "py-2.5 text-lg",
  md: "py-2 text-base",
  sm: "py-1.5 text-sm",
};


const ModalActionButton: React.FC<ModalActionButtonProps> = ({ label, onClick, icon, size }) => {
  const sizeClass = SIZE_CLASS_MAP[size || "md"]; // デフォルト md

  return (
    <button
      className={`w-full bg-[#FFC800] hover:bg-[#D8A900] cursor-pointer text-black rounded-md flex justify-center items-center space-x-2 ${sizeClass}`}
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default ModalActionButton;
