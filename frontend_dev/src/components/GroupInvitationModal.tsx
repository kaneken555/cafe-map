// components/GroupInvitationModal.tsx
import React from "react";
import { X } from "lucide-react";
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
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-60">
      <div
        className="bg-[#fffaf0] w-[400px] p-6 rounded-lg shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-[#6b4226] hover:text-black cursor-pointer"
        >
          <X size={24} />
        </button>

        {/* タイトル */}
        <h2 className="text-xl font-bold text-[#6b4226] mb-4">グループ招待</h2>

        {/* グループ名 */}
        <div className="text-md mb-2 font-semibold">{groupName}</div>

        {/* 招待リンク（再利用セクション） */}
        <ShareLinkSection shareUrl={inviteUrl} />

      </div>
    </div>
  );
};

export default GroupInvitationModal;
