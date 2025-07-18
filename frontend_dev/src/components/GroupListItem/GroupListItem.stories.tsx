// components/GroupListItem.stories.tsx
import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import GroupListItem from "./GroupListItem";
import { Group } from "../../types/group";
import { GroupProvider, useGroup } from "../../contexts/GroupContext";


// ダミーグループデータ
const dummyGroup: Group = {
  id: 1,
  uuid: "abc123",
  name: "開発チームA",
  description: "フロント・バック合同開発チーム",
};

const otherGroup: Group = {
  id: 2,
  uuid: "def456",
  name: "マーケティングチームB",
  description: "SNS運用・広告戦略担当",
};

// GroupProvider を使用したデコレーター
const withSelectedGroupId = (selectedId: number | null) => (Story: any) => (
  <GroupProvider>
    <GroupStateSetter selectedGroupId={selectedId}>
      <ul className="max-w-md mx-auto mt-4">
        <Story />
      </ul>
    </GroupStateSetter>
  </GroupProvider>
);

// 選択中の groupId をセットするためのラッパー
const GroupStateSetter = ({
  selectedGroupId,
  children,
}: {
  selectedGroupId: number | null;
  children: React.ReactNode;
}) => {
  const { setSelectedGroupId } = useGroup();
  React.useEffect(() => {
    setSelectedGroupId(selectedGroupId);
  }, [selectedGroupId, setSelectedGroupId]);

  return <>{children}</>;
};

const meta: Meta<typeof GroupListItem> = {
  title: "Components/GroupListItem",
  component: GroupListItem,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GroupListItem>;

export const Selected: Story = {
  args: {
    group: dummyGroup,
    onSelect: async () => alert("グループを選択しました"),
    onInvite: () => alert("グループに招待します"),
  },
  decorators: [withSelectedGroupId(1)],
};

export const NotSelected: Story = {
  args: {
    group: otherGroup,
    onSelect: async () => alert("グループを選択しました"),
    onInvite: () => alert("グループに招待します"),
  },
  decorators: [withSelectedGroupId(1)],
};