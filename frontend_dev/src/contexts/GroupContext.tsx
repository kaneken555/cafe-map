// context/GroupContext.tsx
import React, { createContext, useContext, useState, useMemo } from "react";
import { Group } from "../types/group";

interface GroupContextProps {
  groupList: Group[];
  setGroupList: React.Dispatch<React.SetStateAction<Group[]>>;
  resetGroupContext: () => void;
}

const GroupContext = createContext<GroupContextProps | undefined>(undefined);

export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groupList, setGroupList] = useState<Group[]>([]);

  const resetGroupContext = () => {
    setGroupList([]);
  };

  const value = useMemo(
    () => ({
      groupList,
      setGroupList,
      resetGroupContext,
    }),
    [groupList]
  );

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
};

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) throw new Error("useGroup must be used within a GroupProvider");
  return context;
};
