// hooks/useCafeActions.ts
import { addCafeToMyCafe, removeCafeFromMap } from "../services/cafeService";
import { Cafe } from "../types/cafe";
import { MapItem } from "../types/map";
import { toast } from "react-hot-toast";
import ReactGA from "react-ga4";


export const useCafeActions = (
  selectedMap: MapItem | null,
  setMyCafeList: React.Dispatch<React.SetStateAction<Cafe[]>>
) => {
  const toggleCafe = (cafe: Cafe, isRegistered: boolean) => {
    if (!selectedMap) {
      toast.error("マップを選択してください");
      return;
    }

    if (isRegistered) {
      // 削除
      removeCafeFromMap(selectedMap.id, cafe.id)
        .then(() => {
          setMyCafeList(prev => prev.filter(c => c.id !== cafe.id));
          toast.success("カフェをマップから削除しました");
          console.log("📡 カフェ削除後:", cafe);
          ReactGA.gtag("event", "cafe_remove", { cafe_name: cafe.name });
        })
        .catch(() => toast.error("カフェの削除に失敗しました"));
    } else {
      // 追加
      addCafeToMyCafe(selectedMap.id, cafe)
        .then(() => {
          setMyCafeList(prev => [...prev, cafe]);
          toast.success("カフェをマップに追加しました");
          console.log("📡 カフェ追加後:", cafe);
          ReactGA.gtag("event", "cafe_add", { cafe_name: cafe.name });
        })
        .catch(() => toast.error("カフェの追加に失敗しました"));
    }
  };

  return { toggleCafe };
};
