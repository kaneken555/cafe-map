// components/CafeMapAssignModal.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import CafeMapAssignModal from "./CafeMapAssignModal";
import { useState } from "react";
import { MapItem } from "../../types/map";
import { MapProvider } from "../../contexts/MapContext";
import { Toaster } from "react-hot-toast";

const meta: Meta<typeof CafeMapAssignModal> = {
  title: "Modals/CafeMapAssignModal",
  component: CafeMapAssignModal,
};

export default meta;

type Story = StoryObj<typeof CafeMapAssignModal>;

const DummyWrapper = () => {
  const [isOpen, setIsOpen] = useState(true);

  const sampleMaps: MapItem[] = [
    { id: 1, name: "マップ1" },
    { id: 2, name: "マップ2" },
    { id: 3, name: "マップ3" },
  ];

  return (
    <MapProvider valueOverride={{ mapList: sampleMaps }}>
      <Toaster />
      <CafeMapAssignModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialSelectedMap={sampleMaps[0]}
        onAdd={(maps) => {
          console.log("選択されたマップ:", maps);
          setIsOpen(false);
        }}
      />
    </MapProvider>
  );
};

export const Default: Story = {
  render: () => <DummyWrapper />,
};
