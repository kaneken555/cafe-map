import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import MapListItem from "./MapListItem";
import { useMapModals } from "../../hooks/useMapModals";
import type { MapItem } from "../../types/map";
import { Toaster } from "react-hot-toast";

const meta: Meta<typeof MapListItem> = {
  title: "Components/MapListItem",
  component: MapListItem,
};
export default meta;

type Story = StoryObj<typeof MapListItem>;

const mockMap: MapItem = {
  id: 1,
  name: "渋谷カフェ巡り",
};

export const Default: Story = {
  render: () => {
    const [selectedMapId, setSelectedMapId] = useState<number | null>(null);
    const modals = useMapModals();

    const handleSelect = (map: MapItem) => {
      setSelectedMapId(map.id);
      alert(`マップ「${map.name}」を選択しました`);
    };

    const handleDelete = async (id: number, name: string) => {
      alert(`マップ「${name}」を削除します（ID: ${id}）`);
    };

    const handleShare = async (id: number): Promise<string | null> => {
      alert(`マップID: ${id} のシェアリンクを生成します`);
      return `https://example.com/shared/${id}`;
    };

    const handleSelectMap = (
      map: MapItem,
      onSelect: (map: MapItem) => void,
      onClose: () => void
    ) => {
      onSelect(map);
      onClose();
    };

    return (
      <>
        <Toaster />
        <ul className="p-4 max-w-md mx-auto">
          <MapListItem
            map={mockMap}
            selectedMapId={selectedMapId}
            onSelect={handleSelect}
            onClose={() => {}}
            onDeleteClick={(map) => handleDelete(map.id, map.name)}
            onShare={handleShare}
            onSelectMap={handleSelectMap}
            mapModals={modals}
          />
        </ul>
      </>
    );
  },
};
