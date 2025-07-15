// components/GroupJoinModal.tsx
import React from "react";
import BaseModal from "./BaseModal/BaseModal";
import ModalActionButton from "./ModalActionButton/ModalActionButton";


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

      <ModalActionButton
        label="参加"
        onClick={onJoin}
        size="md"
      />

    </BaseModal>
  );
};

export default GroupJoinModal;
