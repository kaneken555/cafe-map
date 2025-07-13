import type { Meta, StoryObj } from "@storybook/react";
import { useRef } from "react";
import QRCodeSection from "./QRCodeSection";
import { Toaster } from "react-hot-toast";

const meta: Meta<typeof QRCodeSection> = {
  title: "Components/QRCodeSection",
  component: QRCodeSection,
};
export default meta;

type Story = StoryObj<typeof QRCodeSection>;

export const Default: Story = {
  render: () => {
    const qrWrapperRef = useRef<HTMLDivElement | null>(null);
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <Toaster />
        <QRCodeSection
          qrWrapperRef={qrWrapperRef}
          shareUrl="https://example.com/shared/map/abc123"
        />
      </div>
    );
  },
};
