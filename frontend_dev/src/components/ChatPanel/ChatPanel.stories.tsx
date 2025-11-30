// components/ChatPanel/ChatPanel.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import ChatPanel from "./ChatPanel";

const meta = {
  title: "Components/ChatPanel",
  component: ChatPanel,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ChatPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Close chat panel"),
    children: (
      <div className="p-4">
        <p>チャットコンテンツがここに表示されます</p>
      </div>
    ),
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log("Close chat panel"),
    children: (
      <div className="p-4">
        <p>チャットコンテンツがここに表示されます</p>
      </div>
    ),
  },
};
