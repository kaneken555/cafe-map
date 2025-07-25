// components/CloseButton/CloseButton.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";

import CloseButton from "./CloseButton";

const meta: Meta<typeof CloseButton> = {
  title: "Components/CloseButton",
  component: CloseButton,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CloseButton>;

export const Default: Story = {
  args: {
    onClick: () => alert("Close button clicked!"),
  },
};
