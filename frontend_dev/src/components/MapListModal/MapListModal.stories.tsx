// src/components/Modals/MapListModal.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import MapListModal from "./MapListModal";
import { useState } from "react";
import { MapProvider } from "../../contexts/MapContext";
import { CafeProvider } from "../../contexts/CafeContext";
import { GroupProvider } from "../../contexts/GroupContext";
import { MapItem, SharedMapItem } from "../../types/map";

const meta: Meta<typeof MapListModal> = {
  title: "Modals/MapListModal",
  component: MapListModal,
};

export default meta;
type Story = StoryObj<typeof MapListModal>;

const mockMaps: MapItem[] = [
  { id: 1, name: "渋谷カフェ" },
  { id: 2, name: "表参道マップ" },
];

const mockSharedMapList: SharedMapItem[] = [
  { id: 101, name: "東京シェアマップ", uuid: "abc123" },
];

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MapProvider valueOverride={{ mapList: mockMaps, sharedMapList: mockSharedMapList }}>
    <CafeProvider>
      <GroupProvider>{children}</GroupProvider>
    </CafeProvider>
  </MapProvider>
);

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <Wrapper>
        <MapListModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          selectedMapId={null}
          setSelectedMapId={() => {}}
          onSelectMap={(map) => console.log("Selected", map)}
          onSelectSharedMap={() => {}}
          setShareUuid={() => {}}
        />
      </Wrapper>
    );
  },
};
