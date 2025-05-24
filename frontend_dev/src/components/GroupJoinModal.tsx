// components/GroupJoinModal.tsx
import React from "react";
import CloseModalButton from "./CloseModalButton";
import { MODAL_STYLES } from "../constants/ui";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-60">
      <div className="bg-[#fffaf0] w-[400px] p-6 rounded-lg shadow-md relative">

        <CloseModalButton onClose={onClose} /> {/* ここで共通閉じるボタンを使う */}

        <h2 className={MODAL_STYLES.TITLE}>グループ参加</h2>
        <p className="text-center text-lg mb-6">{groupName}</p>
        <button
          onClick={onJoin}
          className="w-full py-2 bg-[#FFC800] hover:bg-[#D8A900] text-black rounded font-medium"
        >
          参加
        </button>
      </div>
    </div>
  );
};

export default GroupJoinModal;
