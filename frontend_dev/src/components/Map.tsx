// components/Map.tsx
import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import MapButton from "./MapButton"; 
import CafeOverlayIcon from "./CafeOverlayIcon"; // ✅ 切り出したカフェアイコン表示用コンポーネント
import KeywordSearchModal from "./KeywordSearchModal"; // ✅ キーワード検索モーダルをインポート
import LoadingOverlay from "./LoadingOverlay"; // ✅ ローディングオーバーレイコンポーネントをインポート
import { searchCafe, searchCafeByKeyword } from "../api/cafe"; // ✅ カフェ検索APIをインポート
import { Cafe } from "../types/cafe";

import { DEFAULT_CENTER, MAP_CONTAINER_STYLE, MAP_MODES } from "../constants/map";
import toast from "react-hot-toast";

import { useMap } from "../contexts/MapContext";
import { useMapActions } from "../hooks/useMapActions";

import ReactGA from "react-ga4";


interface MapProps {
  cafes: Cafe[];
  onCafeIconClick: (cafe: Cafe) => void;
  selectedCafeId: number | null; 
  setSelectedCafeId: (id: number | null) => void; 
  setSearchResultCafes: (cafes: Cafe[]) => void; // ✅ 検索結果をセットする関数
  shareUuid: string | null; // ✅ シェアマップのUUIDをセットする関数
}


const Map: React.FC<MapProps> = ({ 
  cafes, 
  onCafeIconClick, 
  selectedCafeId,
  setSelectedCafeId, 
  setSearchResultCafes, 
  shareUuid 
}) => {
  const { mapMode, setMapMode } = useMap(); // マップリストのセット関数をコンテキストから取得
  const { registerSharedMap } = useMapActions();
  
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [isMapLoading, setIsMapLoading] = useState(true);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isKeywordSearchOpen, setIsKeywordSearchOpen] = useState(false); // モーダル開閉用

  
  // ✅ マップ中心の位置情報を取得する汎用関数
  const getMapCenter = (): { lat: number; lng: number } | null => {
    if (!mapRef.current) return null;
    const center = mapRef.current.getCenter();
    if (!center) return null;
    return {
      lat: center.lat(),
      lng: center.lng(),
    };
  };

  // 共通の検索処理をまとめる
  const searchCafes = async (center: { lat: number; lng: number }, keyword?: string) => {
    try {
      const cafes = keyword 
        ? await searchCafeByKeyword(keyword, center.lat, center.lng)
        : await searchCafe(center.lat, center.lng);
      setSearchResultCafes(cafes);
      setMapMode(MAP_MODES.search); // ✅ 検索モードに切り替え
    } catch (error) {
      console.error("検索エラー:", error);
      toast.error("カフェの検索に失敗しました");
    }
  };

  const handleSearchClick = async () => {
    const center = getMapCenter();
    if (!center) return;
    console.log("📡 検索実行: 中心座標 =", center.lat, center.lng);
    await searchCafes(center);

    ReactGA.gtag("event", "map_search", {
      search_type: "default",
    });
  };

  const handleKeywordSearchClick = async (keyword: string) => {
    console.log("📡 キーワード検索実行:", keyword);
    const center = getMapCenter();
    if (!center) return;
    await searchCafes(center, keyword);
    setIsKeywordSearchOpen(false);

    ReactGA.gtag("event", "cafe_search", {
      search_type: "keyword",
      keyword: keyword.trim(),
    });
  };
  
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handleRegisterSharedMap = async () => {
    await registerSharedMap(shareUuid);
  }

  return (
    <div className="relative h-full w-full">
      {/* ✅ マップロード中だけオーバーレイ */}
      {isMapLoading && (
        <LoadingOverlay 
          loadingImageSrc="/loading.png"
          minDuration={2000}
          isActive={isMapLoading}
          onFinish={() => setIsMapLoading(false)}
        />
      )}

      {/* ボタン表示 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex space-x-4">
        <MapButton label="更新" onClick={handleSearchClick} />
        <MapButton label="キーワード検索" onClick={() => setIsKeywordSearchOpen(true)} />
      </div>

      {mapMode === MAP_MODES.share && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 flex space-x-4">
          <MapButton 
            label="シェアマップとして保存" 
            onClick={handleRegisterSharedMap}
            />
          <MapButton label="マイマップとして登録" onClick={() => alert("登録処理未実装")}/>
        </div>
      )}

      {isKeywordSearchOpen && (
        <KeywordSearchModal
          onClose={() => setIsKeywordSearchOpen(false)}
          onSearch={handleKeywordSearchClick}
        />
      )}

      <LoadScript 
        googleMapsApiKey={apiKey}
        onError={() => setIsMapLoading(false)} // ✅ エラー時もローディング解除
      >
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={DEFAULT_CENTER}
          zoom={15}
          onLoad={handleMapLoad} // ✅ 時間調整含むロジック
          onUnmount={() => {
            mapRef.current = null;
          }}
          options={{
            mapTypeControl: false,       // 「地図 / 航空写真」切り替えを非表示
            streetViewControl: false,    // ペグマンを非表示
            // fullscreenControl: false,    // 全画面ボタンを非表示
            // zoomControl: false,          // ズームボタンを非表示（必要に応じて）
          }}
        >
          {cafes.map((cafe) => (
            <CafeOverlayIcon
              key={cafe.id}
              cafe={cafe}
              isSelected={selectedCafeId === cafe.id}
              onClick={() => {
                onCafeIconClick(cafe);
                setSelectedCafeId(cafe.id);
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
