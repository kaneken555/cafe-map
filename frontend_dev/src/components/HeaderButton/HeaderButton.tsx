// components/HeaderButton.tsx
import React from "react";
import clsx from "clsx";


interface HeaderButtonProps {
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  size?: "normal" | "small"; // ✅ サイズプロップを追加
  orientation?: "horizontal" | "vertical"; // ✅ 表示方向プロップを追加
}

const HeaderButton: React.FC<HeaderButtonProps> = ({ onClick, disabled, icon, label, active, size = "normal", orientation = "vertical" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "flex items-center justify-center border rounded",
        // ✅ 表示方向に応じてクラスを切り替え
        {
          "flex-col": orientation === "vertical",
          "flex-row gap-1": orientation === "horizontal",
        },
        // ✅ サイズに応じてクラスを切り替え
        {
          "px-2 py-1 w-full md:w-21 h-14": size === "normal",
          "px-1 py-0.5 w-full h-12": size === "small",
        },
        {
          "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed": disabled,
          "bg-blue-500 text-white border-blue-600": !disabled && active,
          "bg-white text-black border-black hover:bg-gray-100 cursor-pointer": !disabled && !active,
        }
      )}
    >
      {icon}
      <span className={clsx({
        "mt-1": orientation === "vertical",
        "text-[10px]": size === "normal",
        "text-[9px]": size === "small",
      })}>{label}</span>
    </button>
  );
};

export default HeaderButton;
