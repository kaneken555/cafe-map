// components/GroupJoinModal.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import GroupJoinModal from "./GroupJoinModal";

const meta: Meta<typeof GroupJoinModal> = {
  title: "Components/GroupJoinModal",
  component: GroupJoinModal,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GroupJoinModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    groupName: "フロントエンド勉強会",
    onClose: () => alert("閉じる処理が呼ばれました"),
    onJoin: () => alert("参加処理が呼ばれました"),
  },
};
