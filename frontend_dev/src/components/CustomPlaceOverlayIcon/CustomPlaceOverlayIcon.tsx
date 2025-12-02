import React from "react";
import { OverlayView } from "@react-google-maps/api";
import { CustomPlace, PlaceType } from "../../types/customPlace";
import { Camera, MapPin, Mountain, Landmark } from "lucide-react";

interface Props {
  place: CustomPlace;
  isSelected: boolean;
  onClick: (place: CustomPlace) => void;
  showLabel?: boolean;
}

// 種別ごとのアイコンと色を取得
const getPlaceTypeIcon = (placeType?: PlaceType) => {
  switch (placeType) {
    case 'photo_spot':
      return { icon: Camera, color: '#3B82F6' }; // 青
    case 'meeting_point':
      return { icon: MapPin, color: '#10B981' }; // 緑
    case 'viewpoint':
      return { icon: Mountain, color: '#8B5CF6' }; // 紫
    case 'memorial':
      return { icon: Landmark, color: '#92400E' }; // 茶色
    default:
      return { icon: MapPin, color: '#3B82F6' }; // デフォルト：青ピン
  }
};

const CustomPlaceOverlayIcon: React.FC<Props> = ({
  place,
  isSelected,
  onClick,
  showLabel = true,
}) => {
  const position = {
    lat: place.latitude,
    lng: place.longitude,
  };

  const { icon: Icon, color } = getPlaceTypeIcon(place.place_type);
  const hasImage = !!place.image_url;

  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        className="cursor-pointer flex flex-col items-center transition-transform duration-150"
        style={{
          transform: isSelected ? 'scale(1.2)' : 'scale(1)',
          zIndex: isSelected ? 20 : 10,
        }}
        onClick={() => onClick(place)}
      >
        {/* 画像がある場合は画像を表示、ない場合はアイコンを表示 */}
        {hasImage ? (
          <div
            className={`overflow-hidden border-2 shadow-md rounded-full border-white ${
              isSelected ? 'w-16 h-16 ring-4 ring-blue-500' : 'w-12 h-12 ring-2 ring-sky-300'
            }`}
          >
            <img
              src={place.image_url}
              alt={place.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            className="rounded-full border-2 border-white shadow-lg flex items-center justify-center"
            style={{
              width: isSelected ? 48 : 40,
              height: isSelected ? 48 : 40,
              backgroundColor: color,
              boxShadow: isSelected
                ? `0 0 0 3px ${color}40`
                : '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            <Icon
              className="text-white"
              size={isSelected ? 24 : 20}
              strokeWidth={2.5}
            />
          </div>
        )}

        {/* 下部の三角形（ピンの先端） - 画像がない場合のみ表示 */}
        {!hasImage && (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: `8px solid ${color}`,
              marginTop: -2,
            }}
          />
        )}

        {/* ラベル表示 */}
        {showLabel && (
          <div
            className="mt-1 px-2 py-1 bg-white/90 rounded text-xs font-medium shadow-md whitespace-nowrap"
            style={{
              maxWidth: 120,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {place.name}
          </div>
        )}
      </div>
    </OverlayView>
  );
};

export default CustomPlaceOverlayIcon;
