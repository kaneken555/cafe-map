// components/CafeDetailInfoTable.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import CafeDetailInfoTable from "./CafeDetailInfoTable";

const meta: Meta<typeof CafeDetailInfoTable> = {
  title: "Components/CafeDetailInfoTable",
  component: CafeDetailInfoTable,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CafeDetailInfoTable>;

export const Default: Story = {
  args: {
    address: "東京都渋谷区道玄坂2-2-2",
    rating: 4.3,
    openTime: "10:00〜18:00",
    phoneNumber: "03-1234-5678",
    website: "https://example-cafe.jp",
  },
};

export const NoPhoneNoWebsite: Story = {
  args: {
    address: "大阪府大阪市北区梅田1-1-1",
    rating: 3.8,
    openTime: "9:00〜17:00",
    phoneNumber: undefined,
    website: undefined,
  },
};
