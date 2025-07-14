// hooks/useCafeMapAssign.ts
import { MapItem } from "../types/map";
import { Cafe } from "../types/cafe";
import { addCafeToMyCafe } from "../api/cafe";
import { toast } from "react-hot-toast";

export const useCafeMapAssign = (
  selectedCafe: Cafe | null,
  setMyCafeList: React.Dispatch<React.SetStateAction<Cafe[]>>
) => {
  const handleAddToMaps = (maps: MapItem[]) => {
    if (!selectedCafe) return;

    maps.forEach((map) => {
      addCafeToMyCafe(map.id, selectedCafe);
      console.log(`カフェ「${selectedCafe.name}」をマップ「${map.name}」に追加`);
    });

    setMyCafeList((prev) => {
      const exists = prev.some((c) => c.placeId === selectedCafe.placeId);
      return exists ? prev : [...prev, selectedCafe];
    });

    toast.success("カフェをマップに追加しました");
  };

  return {
    handleAddToMaps,
  };
};
