// components/Map/Map.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Map from "./Map";
import { Cafe } from "../../types/cafe";
import { MapProvider } from "../../contexts/MapContext";
import { CafeProvider } from "../../contexts/CafeContext";
import { MAP_MODES } from "../../constants/map";

// ✅ モックカフェデータ
const mockCafes: Cafe[] = [
  {
    id: 1,
    placeId: "abc123",
    name: "カフェ ブラン",
    address: "東京都渋谷区恵比寿西1-1-1",
    openTime: "10:00〜19:00",
    status: "営業中",
    distance: "200m",
    photoUrls: ["https://upload.wikimedia.org/wikipedia/commons/3/3f/Starbucks_Coffee_restaurant.png"],
    rating: 4.3,
    userRatingTotal: 125,
    priceLevel: 2,
    phoneNumber: "03-1234-5678",
    website: "https://cafe-blanc.example.com",
    lat: 35.6467,
    lng: 139.7094,
    businessStatus: "OPERATIONAL",
  },
  {
    id: 2,
    placeId: "def456",
    name: "カフェ ノワール",
    address: "東京都目黒区中目黒2-2-2",
    openTime: "11:00〜21:00",
    status: "営業中",
    distance: "400m",
    photoUrls: ["https://upload.wikimedia.org/wikipedia/commons/e/e2/Doutor_Coffee_Senbayashi.jpg"],
    rating: 4.0,
    userRatingTotal: 87,
    priceLevel: 1,
    phoneNumber: "03-9876-5432",
    website: "https://cafe-noir.example.com",
    lat: 35.6412,
    lng: 139.7035,
    businessStatus: "OPERATIONAL",
  },
];


const meta: Meta<typeof Map> = {
  title: "Map",
  component: Map,
};

export default meta;
type Story = StoryObj<typeof Map>;

// ✅ ラッパーでコンテキスト提供
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MapProvider valueOverride={{ mapMode: MAP_MODES.mycafe }}>
    <CafeProvider>{children}</CafeProvider>
  </MapProvider>
);

export const Default: Story = {
  render: () => {
    const [selectedCafeId, setSelectedCafeId] = useState<number | null>(null);
    const [searchResultCafes, setSearchResultCafes] = useState<Cafe[]>([]);

    return (
      <Wrapper>
        <div style={{ height: "600px", width: "100%" }}>
          <Map
            cafes={mockCafes}
            onCafeIconClick={(cafe) => {
              alert(`「${cafe.name}」がクリックされました`);
            }}
            selectedCafeId={selectedCafeId}
            setSelectedCafeId={setSelectedCafeId}
            setSearchResultCafes={setSearchResultCafes}
            shareUuid={null}
          />
        </div>
      </Wrapper>
    );
  },
};
