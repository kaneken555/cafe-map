// components/GroupJoinModal.tsx
import React from "react";
import BaseModal from "./BaseModal";


interface GroupJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  onJoin: () => void;
}

const GroupJoinModal: React.FC<GroupJoinModalProps> = ({
  isOpen,
  onClose,
  groupName,
  onJoin,
}) => {

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="グループ参加" size="md">

        <p className="text-center text-lg mb-6">{groupName}</p>
        <button
          onClick={onJoin}
          className="w-full py-2 bg-[#FFC800] hover:bg-[#D8A900] text-black rounded font-medium"
        >
          参加
        </button>

    </BaseModal>
  );
};

export default GroupJoinModal;
