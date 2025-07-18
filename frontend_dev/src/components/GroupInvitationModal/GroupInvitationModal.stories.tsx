// components/GroupInvitationModal.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import GroupInvitationModal from "./GroupInvitationModal";

const meta: Meta<typeof GroupInvitationModal> = {
  title: "Components/GroupInvitationModal",
  component: GroupInvitationModal,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GroupInvitationModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    groupName: "カフェ開拓メンバー",
    inviteUrl: "https://example.com/group/invite/abc123",
    onClose: () => alert("モーダルを閉じました"),
  },
};
