// src/components/SharedMapRegisterModal/SharedMapRegisterModal.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import SharedMapRegisterModal from "./SharedMapRegisterModal";
import { useState } from "react";
import { MapProvider } from "../../contexts/MapContext";
import { SharedMapItem } from "../../types/map";

const meta: Meta<typeof SharedMapRegisterModal> = {
  title: "Modals/SharedMapRegisterModal",
  component: SharedMapRegisterModal,
};
export default meta;

type Story = StoryObj<typeof SharedMapRegisterModal>;

const mockSharedMap: SharedMapItem = {
  id: 1,
  name: "京都おすすめカフェマップ",
  uuid: "mock-uuid-123",
};

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MapProvider
    valueOverride={{
      mapList: [],
      setMapList: () => {}, // 必要であれば console.log に変更可
    }}
  >
    {children}
  </MapProvider>
);

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <Wrapper>
        <SharedMapRegisterModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          initialMapName="京都おすすめカフェマップ"
          map={mockSharedMap}
        />
      </Wrapper>
    );
  },
};
