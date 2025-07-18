// components/CafeListItem.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import CafeListItem from "./CafeListItem";
import { Cafe } from "../../types/cafe";

const meta: Meta<typeof CafeListItem> = {
  title: "Components/CafeListItem",
  component: CafeListItem,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CafeListItem>;

const mockCafe: Cafe = {
  id: 1,
  placeId: "abc123",
  name: "カフェ・ド・モック",
  address: "東京都中央区1-1-1",
  openTime: "9:00〜19:00",
  status: "営業中",
  distance: "250m",
  price_day: "¥1000",
  price_night: "¥1500",
  photoUrls: ["https://via.placeholder.com/120x90"],
  rating: 4.1,
  userRatingTotal: 84,
  priceLevel: 2,
  phoneNumber: "03-1111-2222",
  website: "https://cafedemock.jp",
  lat: 35.6895,
  lng: 139.6917,
  businessStatus: "OPERATIONAL",
};

export const Default: Story = {
  args: {
    cafe: mockCafe,
    onClick: (cafe: Cafe) => alert(`クリックされたカフェ: ${cafe.name}`),
  },
};
