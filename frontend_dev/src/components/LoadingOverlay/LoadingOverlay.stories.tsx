// src/components/LoadingOverlay.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import LoadingOverlay from "./LoadingOverlay";
import { useState } from "react";

const meta: Meta<typeof LoadingOverlay> = {
  title: "Components/LoadingOverlay",
  component: LoadingOverlay,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof LoadingOverlay>;

// ✅ 画像あり・minDuration付きの例
export const WithImage: Story = {
  render: () => {
    const [isActive, setIsActive] = useState(false);

    return (
      <div className="relative w-full h-64 border">
        <button
          onClick={() => setIsActive(true)}
          className="absolute top-2 left-2 px-4 py-2 bg-blue-500 text-white rounded z-10"
        >
          Show Loading
        </button>
        <LoadingOverlay
          isActive={isActive}
          minDuration={1500}
          loadingImageSrc="./loading.png"
          onFinish={() => {
            setTimeout(() => setIsActive(false), 500); // 少し余裕をもって非表示
          }}
        />
      </div>
    );
  },
};

// ✅ デフォルトローダー（画像なし）
export const Default: Story = {
  render: () => {
    const [isActive, setIsActive] = useState(false);

    return (
      <div className="relative w-full h-64 border">
        <button
          onClick={() => setIsActive(true)}
          className="absolute top-2 left-2 px-4 py-2 bg-green-600 text-white rounded z-10"
        >
          Show Loader
        </button>
        <LoadingOverlay
          isActive={isActive}
          minDuration={1000}
          onFinish={() => {
            setTimeout(() => setIsActive(false), 500);
          }}
        />
      </div>
    );
  },
};
