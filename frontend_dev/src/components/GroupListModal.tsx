// components/GroupListModal.tsx
import React, { useState } from "react";
import CloseModalButton from "./CloseModalButton";
import GroupCreateModal from "./GroupCreateModal";
import GroupInvitationModal from "./GroupInvitationModal";
import GroupListItem from "./GroupListItem"; 
import GroupSearchModal from "./GroupSearchModal";
import GroupJoinModal from "./GroupJoinModal";
import ModalActionButton from "./ModalActionButton";
import { Users } from "lucide-react";
import { Group } from "../types/group";
import { MapItem } from "../types/map";
import { fetchGroupList, joinGroup } from "../api/group";
import { getMapList, getGroupMapList } from "../api/map";
import { toast } from "react-hot-toast";
import { extractUuidFromUrl } from "../utils/extractUuid";
import { MODAL_STYLES } from "../constants/ui";


interface GroupListModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupList: Group[];
  setGroupList: React.Dispatch<React.SetStateAction<Group[]>>;
  onSelectGroup: (group: Group | null) => void;
  setMapList: React.Dispatch<React.SetStateAction<MapItem[]>>; 
  selectedGroupId: number | null;
  setSelectedGroupId: React.Dispatch<React.SetStateAction<number | null>>;
}

const GroupListModal: React.FC<GroupListModalProps> = ({
  isOpen,
  onClose,
  groupList,
  setGroupList,
  onSelectGroup,
  setMapList,
  selectedGroupId,
  setSelectedGroupId,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false); // ✅ 招待モーダル状態
  const [inviteTargetGroup, setInviteTargetGroup] = useState<Group | null>(null); // ✅ 招待対象
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false); // グループ検索モーダル
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);     // グループ参加モーダル
  const [joiningGroupName, setJoiningGroupName] = useState("");      // 参加対象グループ名
  const [joiningGroupUuid, setJoiningGroupUuid] = useState<string>("");


  if (!isOpen) return null;

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
  
  const handleGroupJoin = async () => {
    try {
      await joinGroup(joiningGroupUuid); // ✅ ここで参加API実行
      const updatedGroups = await fetchGroupList();
      setGroupList(updatedGroups);
      toast.success("グループに参加しました");
      setIsJoinModalOpen(false);
    } catch (error) {
      toast.error("グループ参加に失敗しました");
    }
  };
  
  
  const handleGroupSelect = async (group: Group) => {
    try {
      setSelectedGroupId(group.id);
      onSelectGroup(group); // 他の親コンポーネントにも通知
  
      const maps = await getGroupMapList(group.uuid); // グループマップ取得API（未実装ならダミー）
      setMapList(maps);
      toast.success(`グループ「${group.name}」を選択しました`);
    } catch (error) {
      toast.error("グループのマップ取得に失敗しました");
    }
  };
  
  const handleGroupClear = async () => {
    setSelectedGroupId(null);
    onSelectGroup(null);
    try {
      const userMaps = await getMapList();
      setMapList(userMaps); // ✅ ユーザーのマップ一覧に切り替え
      toast.success("グループ選択を解除しました");
    } catch (error) {
      toast.error("マップ一覧の取得に失敗しました");
    }  };

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
        onJoin={handleGroupJoin}
      />

      <div 
        className={MODAL_STYLES.MAIN_MODAL.CONTAINER}
        onClick={onClose}
      >
        <div
          className="bg-[#fffaf0] w-[700px] max-w-full rounded-lg p-6 shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >

          <CloseModalButton onClose={onClose} /> {/* ここで共通閉じるボタンを使う */}

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

        </div>
      </div>
    </>
  );
};

export default GroupListModal;
