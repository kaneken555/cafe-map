// components/ShareLinkSection/ShareLinkSection.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import ShareLinkSection from "./ShareLinkSection";
import { Toaster } from "react-hot-toast";

const meta: Meta<typeof ShareLinkSection> = {
  title: "Components/ShareLinkSection",
  component: ShareLinkSection,
};
export default meta;

type Story = StoryObj<typeof ShareLinkSection>;

export const Default: Story = {
  render: () => (
    <div className="p-4 max-w-md">
      {/* トースト通知が機能するように Toaster を配置 */}
      <Toaster />
      <ShareLinkSection shareUrl="https://example.com/shared/map/abc123" />
    </div>
  ),
};
