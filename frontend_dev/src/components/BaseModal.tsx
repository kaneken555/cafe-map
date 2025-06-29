import React from "react";
import { MODAL_STYLES } from "../constants/ui";
import CloseModalButton from "./CloseModalButton";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, title, icon, children }) => {
  if (!isOpen) return null;

  return (
    <div className={MODAL_STYLES.MAIN_MODAL.CONTAINER} onClick={onClose}>
      <div
        className="bg-[#fffaf0] w-[700px] max-w-full rounded-lg p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <CloseModalButton onClose={onClose} />
        {title && (
          <div className="flex items-center mb-6">
            {icon && <span className="mr-2">{icon}</span>}
            <h2 className="text-xl font-bold text-[#6b4226]">{title}</h2>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default BaseModal;