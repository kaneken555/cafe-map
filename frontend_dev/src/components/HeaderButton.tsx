// components/HeaderButton.tsx
import React from "react";
import clsx from "clsx";


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
      className={clsx(
        "flex flex-col items-center justify-center px-2 py-1 border rounded",
        "w-full md:w-21 h-14",
        {
          "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed": disabled,
          "bg-blue-500 text-white border-blue-600": !disabled && active,
          "bg-white text-black border-black hover:bg-gray-100 cursor-pointer": !disabled && !active,
        }
      )}
    >
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  );
};

export default HeaderButton;
