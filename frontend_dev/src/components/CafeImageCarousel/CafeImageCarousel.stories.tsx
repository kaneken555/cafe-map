// components/CafeImageCarousel.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import CafeImageCarousel from "./CafeImageCarousel";

const meta: Meta<typeof CafeImageCarousel> = {
  title: "Components/CafeImageCarousel",
  component: CafeImageCarousel,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CafeImageCarousel>;

export const Default: Story = {
  args: {
    photoUrls: [
      "https://source.unsplash.com/400x300/?cafe,1",
      "https://source.unsplash.com/400x300/?cafe,2",
      "https://source.unsplash.com/400x300/?cafe,3",
    ],
    altText: "カフェの画像",
  },
};
