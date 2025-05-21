// components/GroupListModal.tsx
import React, { useState } from "react";
import GroupCreateModal from "./GroupCreateModal";
import GroupInvitationModal from "./GroupInvitationModal";
import GroupListItem from "./GroupListItem"; 
import ModalActionButton from "./ModalActionButton";
import { X, Users } from "lucide-react";
import { Group } from "../types/group";
import { fetchGroupList } from "../api/group";



interface GroupListModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupList: Group[];
  setGroupList: React.Dispatch<React.SetStateAction<Group[]>>;
  onSelectGroup: (group: Group) => void;
}

const GroupListModal: React.FC<GroupListModalProps> = ({
  isOpen,
  onClose,
  groupList,
  setGroupList,
  onSelectGroup,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false); // ✅ 招待モーダル状態
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null); // ✅ 選択中のグループID
  const [inviteTargetGroup, setInviteTargetGroup] = useState<Group | null>(null); // ✅ 招待対象


  if (!isOpen) return null;

  const handleInviteClick = (group: Group) => {
    setInviteTargetGroup(group);
    setIsInviteModalOpen(true);
  };

  return (
    <>
      <GroupCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={async () => {
          const updated = await fetchGroupList();
          setGroupList(updated); // ✅ 一覧を更新
        }}
      />

      <GroupInvitationModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        groupName={inviteTargetGroup?.name ?? ""}
        inviteUrl={`https://example.com/invite/${inviteTargetGroup?.uuid ?? ""}`}
      />

      <div 
        className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-[#fffaf0] w-[700px] max-w-full rounded-lg p-6 shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-lg font-bold text-[#6b4226] hover:text-black cursor-pointer"
          >
            <X size={24} />
          </button>

          <div className="flex items-center mb-6">
            <Users className="w-6 h-6 text-[#6b4226] mr-2" />
            <h2 className="text-xl font-bold text-[#6b4226]">グループ一覧</h2>
          </div>

          <ul className="space-y-2 mb-4">
            {groupList.map((group) => (
              <GroupListItem
                key={group.id}
                group={group}
                selectedGroupId={selectedGroupId}
                onSelect={(g) => {
                  setSelectedGroupId(g.id);
                  onSelectGroup(g);
                }}
                onInvite={handleInviteClick}
              />
            ))}
          </ul>

          {/* <button
            className="w-full py-3 bg-[#FFC800] hover:bg-[#D8A900] cursor-pointer text-black text-lg rounded-xl"
            onClick={() => setIsCreateModalOpen(true)}
          >
            ＋新しいグループを作る
          </button> */}
          <ModalActionButton
            label="＋新しいグループを作る"
            onClick={() => setIsCreateModalOpen(true)}
          />
        </div>
      </div>
    </>
  );
};

export default GroupListModal;
