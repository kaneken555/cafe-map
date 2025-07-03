import React from "react";
import { MODAL_STYLES } from "../constants/ui";
import CloseModalButton from "./CloseModalButton";

type ModalSize = "lg" | "md" | "sm";


interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  size: ModalSize; // ← 追加
}

const SIZE_CLASS_MAP: Record<ModalSize, string> = {
  lg: "w-[700px]",
  md: "w-[400px]",
  sm: "w-96",
};

// コンテナ全体のクラス（背景含む）
const CONTAINER_CLASS_MAP: Record<ModalSize, string> = {
  lg: MODAL_STYLES.MAIN_MODAL.CONTAINER,
  md: MODAL_STYLES.SUB_MODAL.CONTAINER,
  sm: MODAL_STYLES.SUB_MODAL.CONTAINER,
};

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, title, icon, children, size }) => {
  if (!isOpen) return null;

  const sizeClass = SIZE_CLASS_MAP[size];
  const containerClass = CONTAINER_CLASS_MAP[size];

  return (
    <div className={containerClass} onClick={onClose}>
      <div
        className={`bg-[#fffaf0] ${sizeClass} max-w-full rounded-lg p-6 shadow-xl relative`}
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