// hooks/useCafeSearch.ts
import { useCallback } from "react";
import { searchCafe, searchCafeByKeyword } from "../api/cafe";
import { Cafe } from "../types/cafe";
import { MAP_MODES } from "../constants/map";
import { toast } from "react-hot-toast";
import ReactGA from "react-ga4";
import { useMap } from "../contexts/MapContext";

export const useCafeSearch = (
  setSearchResultCafes: (cafes: Cafe[]) => void // ← ここを変更
) => {
  const { setMapMode } = useMap();

  /**
   * カフェを検索する（通常検索またはキーワード検索）
   * @param center - 地図の中心座標
   * @param keyword - 任意のキーワード
   */
  const fetchCafes = useCallback(
    async (center: { lat: number; lng: number }, keyword?: string) => {
      try {
        const cafes = keyword
          ? await searchCafeByKeyword(keyword, center.lat, center.lng)
          : await searchCafe(center.lat, center.lng);
  
        setSearchResultCafes(cafes);
        setMapMode(MAP_MODES.search); // ✅ 検索モードに変更
  
        ReactGA.gtag("event", keyword ? "cafe_search" : "map_search", {
          search_type: keyword ? "keyword" : "default",
          keyword: keyword?.trim(),
        });
      } catch (error) {
        toast.error("カフェの検索に失敗しました");
      }
    },
    [setSearchResultCafes, setMapMode]
  );
  

  return { fetchCafes };
};
