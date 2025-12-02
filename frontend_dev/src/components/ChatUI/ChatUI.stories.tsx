// components/ChatUI/ChatUI.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import ChatUI from "./ChatUI";
import type { Message } from "./ChatUI";

const meta = {
  title: "Components/ChatUI",
  component: ChatUI,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "400px", height: "600px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatUI>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMessages: Message[] = [
  {
    id: 1,
    text: "こんにちは！近くのおすすめカフェを教えてください",
    sender: "user",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: 2,
    text: "こんにちは！渋谷エリアのおすすめカフェをいくつかご紹介します。\n\n1. カフェA - 静かで作業に最適\n2. カフェB - コーヒーが美味しい\n3. カフェC - おしゃれな雰囲気",
    sender: "ai",
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: 3,
    text: "ありがとうございます！",
    sender: "user",
    timestamp: new Date(Date.now() - 30000),
  },
];

export const Empty: Story = {
  args: {
    initialMessages: [],
  },
};

export const WithMessages: Story = {
  args: {
    initialMessages: sampleMessages,
  },
};
