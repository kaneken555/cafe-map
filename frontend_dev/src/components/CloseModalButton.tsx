// components/CloseModalButton.tsx
import React from 'react';
import { X } from 'lucide-react';
import { ICON_SIZES } from '../constants/ui';

interface CloseButtonProps {
  onClose: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {
  return (
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-lg font-bold text-[#6b4226] hover:text-black cursor-pointer"
    >
      <X size={ICON_SIZES.MEDIUM} />
    </button>
  );
};

export default CloseButton;
