// hooks/useMapModals.ts
import { useState } from "react";

export const useMapModals = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSharedMapSearchOpen, setIsSharedMapSearchOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const openShareModal = () => setIsShareModalOpen(true);
  const closeShareModal = () => setIsShareModalOpen(false);
  const openSharedMapSearch = () => setIsSharedMapSearchOpen(true);
  const closeSharedMapSearch = () => setIsSharedMapSearchOpen(false);
  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  return {
    isCreateModalOpen, openCreateModal, closeCreateModal,
    isDeleteModalOpen, openDeleteModal, closeDeleteModal,
    isShareModalOpen, openShareModal, closeShareModal,
    isSharedMapSearchOpen, openSharedMapSearch, closeSharedMapSearch,
    isRegisterModalOpen, openRegisterModal, closeRegisterModal,
  };
};