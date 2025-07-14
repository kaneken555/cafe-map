// components/SearchResultPanel.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import SearchResultPanel from "./SearchResultPanel";
import { Cafe } from "../../types/cafe";

const meta: Meta<typeof SearchResultPanel> = {
  title: "Components/SearchResultPanel",
  component: SearchResultPanel,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof SearchResultPanel>;

const mockCafes: Cafe[] = [
  {
    id: 1,
    placeId: "abc123",
    name: "カフェ・ラテ",
    address: "東京都渋谷区1-1-1",
    openTime: "10:00〜20:00",
    status: "営業中",
    distance: "500m",
    price_day: "¥1000",
    price_night: "¥1500",
    photoUrls: ["https://via.placeholder.com/100"],
    rating: 4.2,
    userRatingTotal: 120,
    priceLevel: 2,
    phoneNumber: "03-1234-5678",
    website: "https://cafelatte.jp",
    lat: 35.658034,
    lng: 139.701636,
    businessStatus: "OPERATIONAL",
  },
  {
    id: 2,
    placeId: "def456",
    name: "サンセットコーヒー",
    address: "東京都港区2-2-2",
    openTime: "9:00〜18:00",
    status: "営業中",
    distance: "750m",
    price_day: "¥1200",
    price_night: "¥1600",
    photoUrls: ["https://via.placeholder.com/100"],
    rating: 4.5,
    userRatingTotal: 89,
    priceLevel: 3,
    phoneNumber: "03-9876-5432",
    website: "https://sunsetcoffee.jp",
    lat: 35.6581,
    lng: 139.702,
    businessStatus: "OPERATIONAL",
  },
];
  

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => alert("モーダルを閉じました"),
    cafes: mockCafes,
    onCafeClick: (cafe: Cafe) => alert(`カフェクリック: ${cafe.name}`),
  },
};

export const NoResults: Story = {
  args: {
    isOpen: true,
    onClose: () => alert("モーダルを閉じました"),
    cafes: [],
    onCafeClick: (cafe: Cafe) => alert(`カフェクリック: ${cafe.name}`),
  },
};
