import React from "react";

interface MapButtonProps {
  label: string;
  onClick: () => void;
}

const MapButton: React.FC<MapButtonProps> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium hover:bg-gray-100"
  >
    {label}
  </button>
);

export default MapButton;
