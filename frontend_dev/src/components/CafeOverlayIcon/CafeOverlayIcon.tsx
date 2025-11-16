// components/CafeOverlayIcon.tsx
import React from "react";
import { OverlayView } from "@react-google-maps/api";
import { Cafe } from "../../types/cafe";

// 表示バリエーション
type IconVariant = "photo" | "pin" | "badge" | "bubble";

interface Props {
  cafe: Cafe;
  isSelected: boolean;
  onClick: (cafe: Cafe) => void;
  showLabel?: boolean;    // ✅ 店名ラベルを表示するかどうか
  variant?: IconVariant;  // ✅ 表示スタイル（photo/pin/badge/bubble）
  color?: string;         // ✅ カスタムカラー（Tailwind名 or HEX）
  size?: number;          // ✅ アイコンサイズ（px単位）
}

const CafeOverlayIcon: React.FC<Props> = ({
  cafe,
  isSelected,
  onClick,
  showLabel = true,
  variant = "photo",    // デフォルト：従来の写真型
  color = "#3B82F6",  // デフォルト：青 (#3B82F6 は Tailwind の blue-500)
  size = 48,            // デフォルトサイズ：48px
}) => {
  const imageUrl = cafe.photoUrls?.[0] || "/no-image.png";

  // ✅ variantに応じたスタイル切替
  const baseClasses =
    "cursor-pointer flex flex-col items-center transition-transform duration-150";
  const isActive = isSelected ? "scale-110 z-20" : "scale-100 z-10";

  let iconContent: React.ReactNode;

  const iconSize = size ?? 48; // デフォルト48px

  switch (variant) {
    case "photo":
      iconContent = (
        <div
          className={`overflow-hidden border-2 shadow-md rounded-full border-white
            ${isSelected ? "w-16 h-16 ring-4 ring-blue-500" : "w-12 h-12 ring-2 ring-sky-300"}`}
        >
          <img src={imageUrl} alt={cafe.name} className="w-full h-full object-cover" />
        </div>
      );
      break;

    case "pin":
      iconContent = (
        <div
          className="relative"
          style={{
            width: iconSize / 2,
            height: iconSize / 2,
            backgroundColor: color, // ✅ カスタム色適用
            borderRadius: "50%",
            border: "2px solid white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: -Math.round(iconSize / 8),
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "${Math.round(iconSize / 8)}px solid transparent",
              borderRight: "${Math.round(iconSize / 8)}px solid transparent",
              borderTop: `${Math.round(iconSize / 6)}px solid ${color}`, // ✅ 下部の三角も同色
            }}
          />
        </div>
      );
      break;

    case "badge":
      iconContent = (
        <div
          className={`rounded-md px-2 py-1 text-sm font-medium text-white bg-emerald-600 border border-white shadow-md
            ${isSelected ? "ring-4 ring-blue-500" : ""}`}
          style={{ backgroundColor: color }} // ✅ バッジ色変更
        >
          ☕︎
        </div>
      );
      break;

    case "bubble":
      iconContent = (
        <div
          className={`px-3 py-2 rounded-full text-sm font-medium bg-white/90 border border-gray-300 shadow-md
            ${isSelected ? "ring-2 ring-blue-400" : ""}`}
          style={{ backgroundColor: `${color}20` }} // ✅ 半透明背景
        >
          {cafe.name}
        </div>
      );
      break;
  }

  return (
    <OverlayView
      position={{ lat: cafe.lat, lng: cafe.lng }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div onClick={() => onClick(cafe)} className={`${baseClasses} ${isActive}`}>
        {iconContent}
        {/* ✅ 店名ラベル（photo/pin/badge時のみ） */}
        {showLabel && variant !== "bubble" && (
          <span 
            className="
              mt-1 text-xs bg-white/80 px-2 py-[2px] rounded 
              shadow-sm whitespace-normal break-keep inline-block text-center
              "
          >
            {cafe.name}
          </span>
        )}
      </div>
    </OverlayView>
  );
};

export default CafeOverlayIcon;
