// components/MapButton.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import MapButton from "./MapButton";

const meta: Meta<typeof MapButton> = {
  title: "Buttons/MapButton",
  component: MapButton,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof MapButton>;

export const Default: Story = {
  args: {
    label: "現在地を表示",
    onClick: () => alert("ボタンがクリックされました"),
  },
};
