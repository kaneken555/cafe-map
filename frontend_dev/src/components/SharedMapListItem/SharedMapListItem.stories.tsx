// components/SharedMapListItem.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import SharedMapListItem from "./SharedMapListItem";
import { SharedMapItem } from "../../types/map";
import { useMapModals } from "../../hooks/useMapModals";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { MapProvider } from "../../contexts/MapContext";


const meta: Meta<typeof SharedMapListItem> = {
  title: "Components/SharedMapListItem",
  component: SharedMapListItem,
};

export default meta;

type Story = StoryObj<typeof SharedMapListItem>;

const Wrapper: React.FC = () => {
  const [selectedMapId, setSelectedMapId] = useState<number | null>(null);
  const modals = useMapModals();

  const sampleSharedMap: SharedMapItem = {
    id: 1,
    uuid: "abc-123",
    name: "共有マップ1",
  };

  return (
    <MapProvider>
      <div className="p-4">
        <Toaster />
        <ul>
          <SharedMapListItem
            map={sampleSharedMap}
            selectedMapId={selectedMapId}
            onSelect={(map) => setSelectedMapId(map.id)}
            onClose={() => console.log("モーダル閉じる処理")}
            mapModals={modals}
          />
        </ul>
      </div>
    </MapProvider>
  );
};

export const Default: Story = {
  render: () => <Wrapper />,
};
