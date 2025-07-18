// components/GoogleMapButton.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import GoogleMapButton from "./GoogleMapButton";

const meta: Meta<typeof GoogleMapButton> = {
  title: "Components/GoogleMapButton",
  component: GoogleMapButton,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GoogleMapButton>;

export const Default: Story = {
  args: {
    url: "https://www.google.com/maps/place/東京タワー/",
  },
};
