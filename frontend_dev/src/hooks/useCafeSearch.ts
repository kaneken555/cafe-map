// hooks/useCafeSearch.ts
import { useCallback } from "react";
import { searchCafe, searchCafeByKeyword } from "../services/cafeService";
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

        // 検索結果が0件の場合の通知
        if (cafes.length === 0) {
          toast.error("カフェが見つかりませんでした");
          setSearchResultCafes([]);
          return;
        }

        setSearchResultCafes(cafes);
        setMapMode(MAP_MODES.search); // ✅ 検索モードに変更

        // 成功時の通知（オプション）
        toast.success(`${cafes.length}件のカフェが見つかりました`);

        ReactGA.gtag("event", keyword ? "cafe_search" : "map_search", {
          search_type: keyword ? "keyword" : "default",
          keyword: keyword?.trim(),
          results_count: cafes.length,
        });
      } catch (error: any) {
        console.error("カフェ検索エラー:", error);

        // エラーの種類に応じたメッセージ
        if (error.response) {
          // バックエンドからのエラーレスポンス
          const status = error.response.status;
          if (status === 400) {
            toast.error("検索パラメータが正しくありません");
          } else if (status === 500) {
            toast.error("サーバーエラーが発生しました。後ほど再試行してください");
          } else {
            toast.error("カフェの検索に失敗しました");
          }
        } else if (error.request) {
          // ネットワークエラー
          toast.error("ネットワークエラーが発生しました。接続を確認してください");
        } else {
          // その他のエラー
          toast.error("カフェの検索に失敗しました");
        }

        // エラー時も空配列を設定
        setSearchResultCafes([]);

        // エラーをGoogle Analyticsに送信
        ReactGA.gtag("event", "cafe_search_error", {
          error_message: error.message,
          search_type: keyword ? "keyword" : "default",
        });
      }
    },
    [setSearchResultCafes, setMapMode]
  );
  

  return { fetchCafes };
};
