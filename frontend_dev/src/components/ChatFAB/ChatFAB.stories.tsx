// components/ChatFAB/ChatFAB.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import ChatFAB from "./ChatFAB";

const meta = {
  title: "Components/ChatFAB",
  component: ChatFAB,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ChatFAB>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: {
    isOpen: false,
    onClick: () => console.log("Chat FAB clicked"),
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
    onClick: () => console.log("Chat FAB clicked"),
  },
};
