// hooks/useCafeMapAssign.ts
import { MapItem } from "../types/map";
import { Cafe } from "../types/cafe";
import { addCafeToMyCafe } from "../services/cafeService";
import { toast } from "react-hot-toast";

export const useCafeMapAssign = (
  targetCafe: Cafe | null,
  setMyCafeList: React.Dispatch<React.SetStateAction<Cafe[]>>
) => {
  const handleAddToMaps = (maps: MapItem[]) => {
    if (!targetCafe) return;

    maps.forEach((map) => {
      addCafeToMyCafe(map.id, targetCafe);
      console.log(`カフェ「${targetCafe.name}」をマップ「${map.name}」に追加`);
    });

    setMyCafeList((prev) => {
      const exists = prev.some((c) => c.placeId === targetCafe.placeId);
      return exists ? prev : [...prev, targetCafe];
    });

    toast.success("カフェをマップに追加しました");
  };

  return {
    handleAddToMaps,
  };
};
