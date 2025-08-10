// hooks/useCafeActions.ts
import { addCafeToMyCafe, removeCafeFromMap } from "../services/cafeService";
import { Cafe } from "../types/cafe";
import { MapItem } from "../types/map";
import { toast } from "react-hot-toast";
import ReactGA from "react-ga4";
import { useCafe } from "../contexts/CafeContext";


export const useCafeActions = (
  selectedMap: MapItem | null,
  setMyCafeList: React.Dispatch<React.SetStateAction<Cafe[]>>
) => {
  const {
    setSelectedRegisteredCafe,
    setSelectedSearchedCafe,
  } = useCafe();
  
  const toggleCafe = async (cafe: Cafe, isRegistered: boolean) => {
    if (!selectedMap) {
      toast.error("マップを選択してください");
      return;
    }

    if (isRegistered) {
      // ===== 削除 =====
      try {
        await removeCafeFromMap(selectedMap.id, cafe.id);
        setMyCafeList(prev => prev.filter(c => c.id !== cafe.id));

        toast.success("カフェをマップから削除しました");
        ReactGA.gtag("event", "cafe_remove", { cafe_name: cafe.name });
      } catch (e) {
        toast.error("カフェの削除に失敗しました");
      }
    } else {
      // ===== 追加 =====
      try {
        const res = await addCafeToMyCafe(selectedMap.id, cafe);
        // backendのIDを反映した「登録済みカフェ」オブジェクトを作る
        const registeredCafe: Cafe = { ...cafe, id: res.id };

        // MyCafeListを更新（重複防止）
        setMyCafeList(prev => {
          const exists = prev.some(c => c.id === registeredCafe.id || c.placeId === registeredCafe.placeId);
          return exists ? prev.map(c => (c.placeId === registeredCafe.placeId ? registeredCafe : c))
                        : [...prev, registeredCafe];
        });

        setSelectedRegisteredCafe(registeredCafe);
        setSelectedSearchedCafe(null);

        toast.success("カフェをマップに追加しました");
        ReactGA.gtag("event", "cafe_add", { cafe_name: cafe.name });
      } catch (e) {
        toast.error("カフェの追加に失敗しました");
      }
    }
  };

  return { toggleCafe };
};
