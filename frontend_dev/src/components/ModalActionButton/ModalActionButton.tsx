// components/ModalActionButton/ModalActionButton.tsx
import React from "react";

type ModalSize = "lg" | "md" | "sm"; // BaseModalと合わせる

interface ModalActionButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  size?: ModalSize;
  disabled?: boolean; // ✅ 追加
}

const SIZE_CLASS_MAP: Record<ModalSize, string> = {
  lg: "py-2.5 text-lg",
  md: "py-2 text-base",
  sm: "py-1.5 text-sm",
};

const ModalActionButton: React.FC<ModalActionButtonProps> = ({
  label,
  onClick,
  icon,
  size = "md",
  disabled = false,
}) => {
  const sizeClass = SIZE_CLASS_MAP[size];
  const baseClass =
    "w-full rounded-md flex justify-center items-center space-x-2 font-medium transition-colors";
  const activeClass =
    "bg-[#FFC800] hover:bg-[#D8A900] text-black cursor-pointer";
  const disabledClass =
    "bg-gray-300 text-gray-600 cursor-not-allowed opacity-70";

  return (
    <button
      className={`${baseClass} ${sizeClass} ${
        disabled ? disabledClass : activeClass
      }`}
      onClick={!disabled ? onClick : undefined} // 無効時はクリック不可
      disabled={disabled}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default ModalActionButton;
