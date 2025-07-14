// components/GroupSearchModal.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import GroupSearchModal from "./GroupSearchModal";

const meta: Meta<typeof GroupSearchModal> = {
  title: "Components/GroupSearchModal",
  component: GroupSearchModal,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GroupSearchModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => alert("モーダルを閉じました"),
    onSearch: (input: string) => alert(`検索実行: ${input}`),
  },
};
