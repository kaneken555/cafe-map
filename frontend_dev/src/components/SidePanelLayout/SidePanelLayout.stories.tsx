// components/SidePanelLayout.stories.tsx
import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import SidePanelLayout from "./SidePanelLayout";

const meta: Meta<typeof SidePanelLayout> = {
  title: "Components/SidePanelLayout",
  component: SidePanelLayout,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SidePanelLayout>;

const mockCafes = [
  {
    id: 1,
    name: "カフェひまわり",
    status: "営業中",
    openTime: "10:00-18:00",
    distance: "500m",
    placeId: "abc123",
    address: "東京都渋谷区1-1-1",
    photoUrls: ["/no-image.png"],
    rating: 4.2,
    lat: 35.6895,
    lng: 139.6917,
  },
  {
    id: 2,
    name: "コーヒーと本",
    status: "営業時間外",
    openTime: "12:00-20:00",
    distance: "1.2km",
    placeId: "def456",
    address: "東京都新宿区2-2-2",
    photoUrls: [],
    rating: 3.9,
    lat: 35.6896,
    lng: 139.7000,
  },
];

export const WithCafeList: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <SidePanelLayout
        isOpen={isOpen}
        onClose={() => {
          alert("パネルを閉じます");
          setIsOpen(false);
        }}
        title="検索結果（モック）"
      >
        <input
          type="text"
          placeholder="キーワードを入力"
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none"
        />
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {mockCafes.map((cafe) => (
            <div
              key={cafe.id}
              className="p-2 border rounded shadow-sm hover:bg-gray-100 cursor-pointer"
              onClick={() => alert(`カフェ「${cafe.name}」がクリックされました`)}
            >
              <div className="font-bold text-sm">{cafe.name}</div>
              <div className="text-blue-600 text-xs">{cafe.status}</div>
              <div className="text-xs text-gray-500">{cafe.distance}</div>
            </div>
          ))}
        </div>
      </SidePanelLayout>
    );
  },
};
