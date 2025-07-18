// components/ModalActionButton.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import ModalActionButton from "./ModalActionButton";
import { Plus, Trash2 } from "lucide-react"; // 任意のアイコン例として使用

const meta: Meta<typeof ModalActionButton> = {
  title: "Components/ModalActionButton",
  component: ModalActionButton,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ModalActionButton>;

export const Default: Story = {
  args: {
    label: "実行する",
    onClick: () => alert("ボタンがクリックされました"),
  },
};

export const WithPlusIcon: Story = {
  args: {
    label: "追加する",
    icon: <Plus size={20} />,
    onClick: () => alert("追加しました"),
  },
};

export const WithTrashIcon: Story = {
  args: {
    label: "削除する",
    icon: <Trash2 size={20} />,
    onClick: () => alert("削除しました"),
  },
};
