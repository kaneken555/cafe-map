// components/MyCafeListPanel.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import MyCafeListPanel from "./MyCafeListPanel";
import type { Cafe } from "../../types/cafe";

const meta: Meta<typeof MyCafeListPanel> = {
  title: "Components/MyCafeListPanel",
  component: MyCafeListPanel,
};
export default meta;

type Story = StoryObj<typeof MyCafeListPanel>;

const mockCafes: Cafe[] = [
  {
    id: 1,
    placeId: "place-001",
    name: "カフェ・ド・モック",
    address: "東京都渋谷区1-1-1",
    openTime: "9:00-18:00",
    status: "open",
    distance: "300m",
    photoUrls: [],
    rating: 4.5,
    lat: 35.659,
    lng: 139.700,
    phoneNumber: "03-1234-5678",
    website: "https://cafe.example.com",
  },
  {
    id: 2,
    placeId: "place-002",
    name: "モックカフェ",
    address: "東京都新宿区2-2-2",
    openTime: "10:00-20:00",
    status: "open",
    distance: "500m",
    photoUrls: [],
    rating: 4.2,
    lat: 35.690,
    lng: 139.703,
  },
];

export const Default: Story = {
  render: () => (
    <div className="h-screen">
      <MyCafeListPanel
        isOpen={true}
        onClose={() => alert("閉じる")}
        cafes={mockCafes}
        onCafeClick={(cafe) => alert(`${cafe.name} をクリック`)}
      />
    </div>
  ),
};
