// components/CafeOverlayIcon.tsx
import React from "react";
import { OverlayView } from "@react-google-maps/api";
import { Cafe } from "../types/cafe";


interface Props {
  cafe: Cafe;
  isSelected: boolean;
  onClick: (cafe: Cafe) => void;
}

const CafeOverlayIcon: React.FC<Props> = ({ cafe, isSelected, onClick }) => (
  <OverlayView
    position={{ lat: cafe.lat, lng: cafe.lng }}
    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
  >
    <div
      onClick={() => onClick(cafe)}
      className={`overflow-hidden cursor-pointer border-2 shadow-md
        ${isSelected ? "w-16 h-16 ring-4 ring-blue-500" : "w-12 h-12 ring-2 ring-sky-300"}
        rounded-full border-white`}
    >
      <img
        src={cafe.photoUrls?.[0] || "/no-image.png"}
        alt={cafe.name}
        className="w-full h-full object-cover"
      />
    </div>
  </OverlayView>
);

export default CafeOverlayIcon;
