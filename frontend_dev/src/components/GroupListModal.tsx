// components/GroupListModal.tsx
import React, { useState } from "react";
import BaseModal from "./BaseModal";
import GroupCreateModal from "./GroupCreateModal";
import GroupJoinModal from "./GroupJoinModal";
import GroupInvitationModal from "./GroupInvitationModal";
import GroupListItem from "./GroupListItem"; 
import GroupSearchModal from "./GroupSearchModal";
import ModalActionButton from "./ModalActionButton";

import { Users } from "lucide-react";
import { Group } from "../types/group";
import { fetchGroupList } from "../api/group";
import { toast } from "react-hot-toast";
import { extractUuidFromUrl } from "../utils/extractUuid";

import { useGroup } from "../contexts/GroupContext";

import { useGroupActions } from "../hooks/useGroupActions"; // ✅ グループアクションフックをインポート


interface GroupListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGroup: (group: Group | null) => void;
}

const GroupListModal: React.FC<GroupListModalProps> = ({
  isOpen,
  onClose,
  onSelectGroup,
}) => {
  const { groupList, setGroupList, selectedGroupId } = useGroup(); // グループリストのセット関数をコンテキストから取得  

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false); // ✅ 招待モーダル状態
  const [inviteTargetGroup, setInviteTargetGroup] = useState<Group | null>(null); // ✅ 招待対象
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // グループ検索モーダル
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);     // グループ参加モーダル
  const [joiningGroupName, setJoiningGroupName] = useState("");      // 参加対象グループ名
  const [joiningGroupUuid, setJoiningGroupUuid] = useState<string>("");

  const { handleGroupSelect, handleGroupClear, handleGroupJoin } = useGroupActions(onSelectGroup);


  const handleInviteClick = (group: Group) => {
    setInviteTargetGroup(group);
    setIsInviteModalOpen(true);
  };

  const handleGroupSearch = (input: string) => {

    const uuid = extractUuidFromUrl(input);
    if (!uuid) {
      toast.error("有効な招待URLを入力してください");
      return;
    }
    setJoiningGroupUuid(uuid);         // ✅ 後で参加用に保持
    setJoiningGroupName("グループ名取得予定"); // 任意（APIで取得するならここで）

    console.log("UUID:", uuid); // デバッグ用

    // 本来はAPIでグループ情報を取得する
    setIsSearchModalOpen(false);
    setIsJoinModalOpen(true);
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

      <GroupSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleGroupSearch}
      />

      <GroupJoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        groupName={joiningGroupName}
        // onJoin={handleGroupJoin}
        onJoin={() =>
          handleGroupJoin(joiningGroupUuid, () => setIsJoinModalOpen(false))
        }
      />

      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="グループ一覧"
        icon={<Users className="w-6 h-6 text-[#6b4226]" />}
        size="lg" // サイズを指定
      >

        <ul className="space-y-2 mb-4">
          {groupList.map((group) => (
            <GroupListItem
              key={group.id}
              group={group}
              onSelect={handleGroupSelect} // ✅ 非同期対応
              onInvite={handleInviteClick}
            />
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-2 mt-6">
          <ModalActionButton
            label="＋新しいグループを作る"
            onClick={() => setIsCreateModalOpen(true)}
          />
          <ModalActionButton
            label="🔍 グループに参加する"
            onClick={() => setIsSearchModalOpen(true)}
          />
        </div>

        {selectedGroupId !== null && (
          <div className="mt-4">
            <ModalActionButton
              label="🚫 グループ選択を解除"
              onClick={handleGroupClear}
            />
          </div>
        )}

      </BaseModal>
    </>
  );
};

export default GroupListModal;
