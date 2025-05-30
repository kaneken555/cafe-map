// components/ModalActionButton.tsx
import React from "react";

interface ModalActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode; // オプションでアイコンも渡せる
}

const ModalActionButton: React.FC<ModalActionButtonProps> = ({ label, onClick, icon }) => {
  return (
    <button
      className="w-full py-3 bg-[#FFC800] hover:bg-[#D8A900] cursor-pointer text-black text-lg rounded-xl flex justify-center items-center space-x-2"
      onClick={onClick}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default ModalActionButton;
