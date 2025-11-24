// components/SearchSettingsModal/SearchSettingsModal.tsx
import React from "react";
import BaseModal from "../BaseModal/BaseModal";
import { Search } from "lucide-react";

interface SearchSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchSettingsModal: React.FC<SearchSettingsModalProps> = ({ isOpen, onClose }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="検索設定"
      icon={<Search className="w-6 h-6 text-[#6b4226]" />}
      size="md"
    >
      <div className="text-center py-8 text-gray-500">
        <p>検索設定機能は現在準備中です</p>
      </div>
    </BaseModal>
  );
};

export default SearchSettingsModal;
