// hooks/useGroupModals.ts
import { useState } from "react";
import { Group } from "../types/group";

export const useGroupModals = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteTargetGroup, setInviteTargetGroup] = useState<Group | null>(null);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [detailTargetGroup, setDetailTargetGroup] = useState<Group | null>(null);
  const [joiningGroupUuid, setJoiningGroupUuid] = useState("");
  const [joiningGroupName, setJoiningGroupName] = useState("");

  const openCreateModal = () => setCreateModalOpen(true);
  const closeCreateModal = () => setCreateModalOpen(false);

  const openInviteModal = (group: Group) => {
    setInviteTargetGroup(group);
    setInviteModalOpen(true);
  };
  const closeInviteModal = () => setInviteModalOpen(false);

  const openSearchModal = () => setSearchModalOpen(true);
  const closeSearchModal = () => setSearchModalOpen(false);

  const openJoinModal = (name: string, uuid: string) => {
    setJoiningGroupName(name);
    setJoiningGroupUuid(uuid);
    setJoinModalOpen(true);
  };
  const closeJoinModal = () => setJoinModalOpen(false);


  const openDetailModal = (group: Group) => {
    setDetailTargetGroup(group);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailTargetGroup(null);
    setDetailModalOpen(false);
  };

  return {
    isCreateModalOpen, openCreateModal, closeCreateModal,
    isInviteModalOpen, inviteTargetGroup, openInviteModal, closeInviteModal,
    isSearchModalOpen, openSearchModal, closeSearchModal,
    isJoinModalOpen, joiningGroupUuid, joiningGroupName, openJoinModal, closeJoinModal,
    isDetailModalOpen, detailTargetGroup, openDetailModal, closeDetailModal
  };
};
