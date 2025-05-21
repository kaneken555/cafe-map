// components/Map.tsx
import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import MapButton from "./MapButton"; 
import CafeOverlayIcon from "./CafeOverlayIcon"; // ✅ 切り出したカフェアイコン表示用コンポーネント
import KeywordSearchModal from "./KeywordSearchModal"; // ✅ キーワード検索モーダルをインポート
import { mockCafeData } from "../api/mockCafeData";
import LoadingOverlay from "./LoadingOverlay"; // ✅ ローディングオーバーレイコンポーネントをインポート
import { searchCafe, searchCafeByKeyword } from "../api/cafe"; // ✅ カフェ検索APIをインポート
import { Cafe } from "../types/cafe";

import { DEFAULT_CENTER, MAP_CONTAINER_STYLE } from "../constants/map";


interface MapProps {
  cafes: Cafe[];
  onCafeIconClick: (cafe: Cafe) => void;
  setMapMode: (mode: "search" | "mycafe") => void; 
  selectedCafeId: number | null; 
  setSelectedCafeId: (id: number | null) => void; 
  setSearchResultCafes: (cafes: Cafe[]) => void; // ✅ 検索結果をセットする関数
}


// 一旦 mapId=1 固定でもOK。選択中マップに応じて動的に切り替えも可能
// const mapId = 1;
// const cafes = mockCafeData[mapId] || [];

const Map: React.FC<MapProps> = ({ cafes, onCafeIconClick, setMapMode, selectedCafeId ,setSelectedCafeId, setSearchResultCafes }) => {
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


  const handleSearchClick = async () => {
    const center = getMapCenter();
    if (!center) return;
    console.log("📡 検索実行: 中心座標 =", center.lat, center.lng);
  
    const cafeResults = await searchCafe(center.lat, center.lng);
    console.log("📡 カフェ一覧取得結果:", cafeResults);
    setSearchResultCafes(cafeResults);
    setMapMode("search");

  };

  const handleKeywordSearchClick = async (keyword: string) => {
    console.log("📡 キーワード検索実行:", keyword);

    const center = getMapCenter();
    if (!center) return;
  
    const results = await searchCafeByKeyword(keyword, center.lat, center.lng);
    // const results = await searchCafe(center.lat, center.lng);
    console.log("📡 カフェ一覧取得結果:", results);
    setSearchResultCafes(results);
    setMapMode("search");
    setIsKeywordSearchOpen(false); // モーダル閉じる
  };
  
  
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

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
