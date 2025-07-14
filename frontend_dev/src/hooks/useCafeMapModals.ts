// hooks/useCaMefeMapModals.ts
import { useState } from "react";

export const useCafeMapModals = () => {
  const [isCafeMapAssignModalOpen, setIsCafeMapAssignModalOpen] = useState(false);

  const openCafeMapAssignModal = () => setIsCafeMapAssignModalOpen(true);
  const closeCafeMapAssignModal = () => setIsCafeMapAssignModalOpen(false);

  return {
    isCafeMapAssignModalOpen,
    openCafeMapAssignModal,
    closeCafeMapAssignModal,
  };
};
