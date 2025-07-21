// hooks/useCafeActions.ts
import { addCafeToMyCafe } from "../services/cafeService";
import { Cafe } from "../types/cafe";
import { MapItem } from "../types/map";
import { toast } from "react-hot-toast";
import ReactGA from "react-ga4";


export const useCafeActions = (
  selectedMap: MapItem | null,
  setMyCafeList: React.Dispatch<React.SetStateAction<Cafe[]>>
) => {
  const addCafe = (cafe: Cafe) => {
    if (!selectedMap) {
      toast.error("マップを選択してください");
      return;
    }
    addCafeToMyCafe(selectedMap.id, cafe);
    setMyCafeList(prev => [...prev, cafe]);
    ReactGA.gtag("event", "cafe_add", { cafe_name: cafe.name });
  };

  return { addCafe };
};
