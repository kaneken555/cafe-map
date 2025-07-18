// components/SharedMapSearchModal.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import SharedMapSearchModal from "./SharedMapSearchModal";

const meta: Meta<typeof SharedMapSearchModal> = {
  title: "Components/SharedMapSearchModal",
  component: SharedMapSearchModal,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SharedMapSearchModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => alert("モーダルを閉じました"),
    onSearch: (input) => alert(`検索実行: ${input}`),
  },
};
