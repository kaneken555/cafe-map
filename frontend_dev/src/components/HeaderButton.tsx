// components/HeaderButton.tsx
import React from "react";

interface HeaderButtonProps {
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({ onClick, disabled, icon, label, active }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center px-2 py-1 border rounded w-full md:w-21 h-14
        ${disabled
          ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
          : active
          ? "bg-blue-500 text-white border-blue-600" // ✅ アクティブな時は強調色
          : "bg-white text-black cursor-pointer hover:bg-gray-100 border-black"}
      `}
    >
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  );
};

export default HeaderButton;
