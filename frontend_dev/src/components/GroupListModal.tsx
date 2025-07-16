// components/GroupListModal.tsx
import React from "react";
import BaseModal from "./BaseModal/BaseModal";
import GroupCreateModal from "./GroupCreateModal/GroupCreateModal";
import GroupJoinModal from "./GroupJoinModal/GroupJoinModal";
import GroupInvitationModal from "./GroupInvitationModal/GroupInvitationModal";
import GroupListItem from "./GroupListItem/GroupListItem"; 
import GroupSearchModal from "./GroupSearchModal/GroupSearchModal";
import ModalActionButton from "./ModalActionButton/ModalActionButton";

import { Users } from "lucide-react";
import { Group } from "../types/group";
import { fetchGroupList } from "../api/group";
import { toast } from "react-hot-toast";
import { extractUuidFromUrl } from "../utils/extractUuid";

import { useGroup } from "../contexts/GroupContext";

import { useGroupActions } from "../hooks/useGroupActions"; // ✅ グループアクションフックをインポート
import { useGroupModals } from "../hooks/useGroupModals";


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

  const {
    isCreateModalOpen, openCreateModal, closeCreateModal,
    isInviteModalOpen, inviteTargetGroup, openInviteModal, closeInviteModal,
    isSearchModalOpen, openSearchModal, closeSearchModal,
    isJoinModalOpen, joiningGroupUuid, joiningGroupName, openJoinModal, closeJoinModal,
  } = useGroupModals(); // ✅ グループモーダルの状態とハンドラをフックから取得


  const { handleGroupSelect, handleGroupClear, handleGroupJoin } = useGroupActions(onSelectGroup);

  const handleGroupSearch = (input: string) => {
    const uuid = extractUuidFromUrl(input);
    if (!uuid) {
      toast.error("有効な招待URLを入力してください");
      return;
    }
    openJoinModal("グループ名取得予定", uuid); // モーダルを開く
    console.log("UUID:", uuid); // デバッグ用

    // 本来はAPIでグループ情報を取得する
    closeSearchModal();
  };
  

  return (
    <>
      <GroupCreateModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onCreated={async () => {
          const updated = await fetchGroupList();
          setGroupList(updated); // ✅ 一覧を更新
        }}
      />

      <GroupInvitationModal
        isOpen={isInviteModalOpen}
        onClose={closeInviteModal}
        groupName={inviteTargetGroup?.name ?? ""}
        inviteUrl={`https://example.com/invite/${inviteTargetGroup?.uuid ?? ""}`}
      />

      <GroupSearchModal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        onSearch={handleGroupSearch}
      />

      <GroupJoinModal
        isOpen={isJoinModalOpen}
        onClose={closeJoinModal}
        groupName={joiningGroupName}
        // onJoin={handleGroupJoin}
        onJoin={() =>
          handleGroupJoin(joiningGroupUuid, closeJoinModal)
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
              onInvite={openInviteModal}
            />
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-2 mt-6">
          <ModalActionButton
            label="＋新しいグループを作る"
            onClick={openCreateModal}
          />
          <ModalActionButton
            label="🔍 グループに参加する"
            onClick={openSearchModal}
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
