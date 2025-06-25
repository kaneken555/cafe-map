// components/GroupInvitationModal.tsx
import React from "react";
import CloseModalButton from "./CloseModalButton";
import ShareLinkSection from "./ShareLinkSection";
import { MODAL_STYLES } from "../constants/ui";

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
  if (!isOpen) return null;


  return (
    <div className={MODAL_STYLES.SUB_MODAL.CONTAINER}>
      <div
        className="bg-[#fffaf0] w-[400px] p-6 rounded-lg shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >

        <CloseModalButton onClose={onClose} /> {/* ここで共通閉じるボタンを使う */}

        {/* タイトル */}
        <h2 className={MODAL_STYLES.SUB_MODAL.TITLE}>グループ招待</h2>

        {/* グループ名 */}
        <div className="text-md mb-2 font-semibold">{groupName}</div>

        {/* 招待リンク（再利用セクション） */}
        <ShareLinkSection shareUrl={inviteUrl} />

      </div>
    </div>
  );
};

export default GroupInvitationModal;
