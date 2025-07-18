// components/KeywordSearchModal/KeywordSearchModal.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import KeywordSearchModal from "./KeywordSearchModal";


const meta: Meta<typeof KeywordSearchModal> = {
  title: "Modals/KeywordSearchModal",
  component: KeywordSearchModal,
};
export default meta;

type Story = StoryObj<typeof KeywordSearchModal>;

export const Default: Story = {
  render: () => (
    <div className="h-screen">
      <KeywordSearchModal
        onClose={() => alert("モーダルを閉じる")}
        onSearch={(keyword) => alert(`検索キーワード: ${keyword}`)}
      />
    </div>
  ),
};
