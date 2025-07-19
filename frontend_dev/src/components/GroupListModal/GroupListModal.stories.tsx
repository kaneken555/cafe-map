// src/components/GroupListModal/GroupListModal.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import GroupListModal from "./GroupListModal";
import { useState } from "react";
import { GroupProvider } from "../../contexts/GroupContext";
import { MapProvider } from "../../contexts/MapContext";
import { CafeProvider } from "../../contexts/CafeContext";
import { Group } from "../../types/group";

const meta: Meta<typeof GroupListModal> = {
  title: "Modals/GroupListModal",
  component: GroupListModal,
};

export default meta;
type Story = StoryObj<typeof GroupListModal>;

// ✅ モックデータ
const mockGroups: Group[] = [
  { id: 1, name: "開発チーム", uuid: "group-uuid-1" },
  { id: 2, name: "カフェ巡り友の会", uuid: "group-uuid-2" },
];

// ✅ コンテキストラッパー
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MapProvider>
    <CafeProvider>
      <GroupProvider valueOverride={{ groupList: mockGroups }}>
        {children}
      </GroupProvider>
    </CafeProvider>
  </MapProvider>
);

// ✅ デフォルトストーリー
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <Wrapper>
        <GroupListModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelectGroup={(group) => console.log("Selected group:", group)}
        />
      </Wrapper>
    );
  },
};

