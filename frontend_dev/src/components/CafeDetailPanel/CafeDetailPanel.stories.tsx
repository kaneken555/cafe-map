// components/CafeDetailPanel.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import CafeDetailPanel from "./CafeDetailPanel";
import { Cafe } from "../../types/cafe";
import { MapProvider } from "../../contexts/MapContext";
import { CafeProvider } from "../../contexts/CafeContext";

const meta: Meta<typeof CafeDetailPanel> = {
  title: "Panels/CafeDetailPanel",
  component: CafeDetailPanel,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CafeDetailPanel>;

const sampleCafe: Cafe = {
  id: 1,
  placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
  name: "Sample Cafe",
  address: "東京都千代田区丸の内1-1-1",
  openTime: "9:00 - 21:00",
  status: "open",
  distance: "300m",
  photoUrls: [
    "https://upload.wikimedia.org/wikipedia/commons/3/3f/Starbucks_Coffee_restaurant.png",
    "https://upload.wikimedia.org/wikipedia/commons/e/e2/Doutor_Coffee_Senbayashi.jpg",

  ],
  rating: 4.2,
  lat: 35.681236,
  lng: 139.767125,
  phoneNumber: "03-1234-5678",
  website: "https://sample-cafe.com",
};

export const Default: Story = {
  render: () => (
    <MapProvider>
      <CafeProvider>
        <CafeDetailPanel
          cafe={sampleCafe}
          onClose={() => alert("閉じるボタンが押されました")}
          onAddCafeToMapClick={() => alert("カフェ追加モーダルを開きます")}
        />
      </CafeProvider>
    </MapProvider>
  ),
};
