// components/CafeListItem.tsx
import React from "react";
import { Cafe } from "../types/cafe";


interface CafeListItemProps {
  cafe: Cafe;
  onClick: (cafe: Cafe) => void;
}

const CafeListItem: React.FC<CafeListItemProps> = ({ cafe, onClick }) => {
  return (
    <div
      className="flex items-center justify-between mb-2 cursor-pointer hover:bg-gray-100 border rounded-lg shadow-sm p-2"
      onClick={() => onClick(cafe)}
    >
      <div>
        <div className="font-bold text-sm">{cafe.name}</div>
        <div className="text-blue-600 text-xs font-semibold">{cafe.status}</div>
        {/* <div className="text-xs text-gray-500">{cafe.openTime}</div> */}
        <div className="text-xs text-gray-500">{cafe.distance}</div>
      </div>
      <img
        src={cafe.photoUrls?.[0] || "/no-image.png"}
        alt={cafe.name}
        className="w-20 h-16 rounded object-cover ml-2"
      />
    </div>
  );
};

export default CafeListItem;
