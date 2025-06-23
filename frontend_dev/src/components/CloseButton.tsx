import React from "react";
import { X } from 'lucide-react';
import { ICON_SIZES } from '../constants/ui';

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-2 right-3 text-lg font-bold text-gray-600 hover:text-black cursor-pointer"
      aria-label="Close"
    >
      <X size={ICON_SIZES.SMALL} />
    </button>
  );
};

export default CloseButton;
