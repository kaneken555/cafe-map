// components/Map.tsx
import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import MapButton from "./MapButton"; 
import CafeOverlayIcon from "./CafeOverlayIcon"; // ✅ 切り出したカフェアイコン表示用コンポーネント
import { mockCafeData, Cafe } from "../api/mockCafeData"; // 👈 Cafe 型を import
import LoadingOverlay from "./LoadingOverlay"; // ✅ ローディングオーバーレイコンポーネントをインポート
import { searchCafe } from "../api/cafe"; // ✅ カフェ検索APIをインポート

interface MapProps {
  cafes: Cafe[];
  onCafeIconClick: (cafe: Cafe) => void;
  setMapMode: (mode: "search" | "mycafe") => void; 
  selectedCafeId: number | null; 
  setSelectedCafeId: (id: number | null) => void; 
  setSearchResultCafes: (cafes: Cafe[]) => void; // ✅ 検索結果をセットする関数
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 35.681236, // 東京駅の緯度
  lng: 139.767125, // 東京駅の経度
};

// 一旦 mapId=1 固定でもOK。選択中マップに応じて動的に切り替えも可能
// const mapId = 1;
// const cafes = mockCafeData[mapId] || [];

const Map: React.FC<MapProps> = ({ cafes, onCafeIconClick, setMapMode, selectedCafeId ,setSelectedCafeId, setSearchResultCafes }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [isMapLoading, setIsMapLoading] = useState(true);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleSearchClick = async () => {
    if (!mapRef.current) return;

    const center = mapRef.current.getCenter();
    if (!center) return;

    const lat = center.lat();
    const lng = center.lng();
    console.log("📡 検索実行: 中心座標 =", lat, lng);
  
    const cafeResults = await searchCafe(lat, lng);
    console.log("📡 カフェ一覧取得結果:", cafeResults);
    setSearchResultCafes(cafeResults); // ✅ こちらを更新する
    setMapMode("search");

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
      </div>

      <LoadScript 
        googleMapsApiKey={apiKey}
        onError={() => setIsMapLoading(false)} // ✅ エラー時もローディング解除
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
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
