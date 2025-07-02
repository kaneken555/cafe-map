// components/GroupInvitationModal.tsx
import React from "react";
import BaseModal from "./BaseModal";
import ShareLinkSection from "./ShareLinkSection";


interface GroupInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  inviteUrl: string;
}

const GroupInvitationModal: React.FC<GroupInvitationModalProps> = ({
  isOpen,
  onClose,
  groupName,
  inviteUrl,
}) => {


  return (
    <BaseModal
    isOpen={isOpen}
    onClose={onClose}
    title="グループ招待"
    size="md"
    >

      {/* グループ名 */}
      <div className="text-md mb-2 font-semibold">{groupName}</div>

      {/* 招待リンク（再利用セクション） */}
      <ShareLinkSection shareUrl={inviteUrl} />

    </BaseModal>
  );
};

export default GroupInvitationModal;
