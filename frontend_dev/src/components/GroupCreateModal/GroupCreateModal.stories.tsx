// components/GroupCreateModal.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import GroupCreateModal from "./GroupCreateModal";

const meta: Meta<typeof GroupCreateModal> = {
  title: "Components/GroupCreateModal",
  component: GroupCreateModal,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GroupCreateModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => alert("モーダルを閉じました"),
    onCreated: () => alert("グループが作成されました"),
  },
};
