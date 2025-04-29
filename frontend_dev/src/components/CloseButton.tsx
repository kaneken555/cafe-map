import React from "react";

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-0 right-3 text-lg font-bold text-gray-600 hover:text-black"
      aria-label="Close"
    >
      ×
    </button>
  );
};

export default CloseButton;
