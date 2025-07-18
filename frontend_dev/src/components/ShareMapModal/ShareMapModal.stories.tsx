// components/ShareMapModal.stories.tsx
import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import ShareMapModal from "./ShareMapModal";

const meta: Meta<typeof ShareMapModal> = {
  title: "Modals/ShareMapModal",
  component: ShareMapModal,
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj<typeof ShareMapModal>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [shareUrl, setShareUrl] = useState("");

    return (
      <ShareMapModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        shareUrl={shareUrl}
        setShareUrl={setShareUrl}
        selectedMap={{ id: 1, name: "テストマップ" }}
      />
    );
  },
};
