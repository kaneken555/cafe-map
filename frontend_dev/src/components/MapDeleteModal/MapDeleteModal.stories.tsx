// components/MapDeleteModal.stories.tsx
import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import MapDeleteModal from "./MapDeleteModal";

const meta: Meta<typeof MapDeleteModal> = {
  title: "Components/MapDeleteModal",
  component: MapDeleteModal,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MapDeleteModal>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <MapDeleteModal
        isOpen={isOpen}
        onClose={() => {
          alert("キャンセルされました");
          setIsOpen(false);
        }}
        onConfirm={() => {
          alert("削除が確定されました");
          setIsOpen(false);
        }}
        mapName="お気に入りカフェマップ"
      />
    );
  },
};
