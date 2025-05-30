// context/GroupContext.tsx
import React, { createContext, useContext, useState, useMemo } from "react";
import { Group } from "../types/group";

interface GroupContextProps {
  groupList: Group[];
  setGroupList: React.Dispatch<React.SetStateAction<Group[]>>;
  selectedGroup: Group | null;
  setSelectedGroup: React.Dispatch<React.SetStateAction<Group | null>>;
  selectedGroupId: number | null;
  setSelectedGroupId: React.Dispatch<React.SetStateAction<number | null>>;
  resetGroupContext: () => void;
}

const GroupContext = createContext<GroupContextProps | undefined>(undefined);

export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  const resetGroupContext = () => {
    setGroupList([]);
    setSelectedGroup(null);
    setSelectedGroupId(null);
  };

  const value = useMemo(
    () => ({
      groupList,
      setGroupList,
      selectedGroup,
      setSelectedGroup,
      selectedGroupId,
      setSelectedGroupId,
      resetGroupContext,
    }),
    [groupList, selectedGroup, selectedGroupId]
  );

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
};

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) throw new Error("useGroup must be used within a GroupProvider");
  return context;
};
