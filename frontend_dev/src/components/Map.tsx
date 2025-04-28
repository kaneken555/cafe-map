// components/Map.tsx
import React from "react"; // ← useStateを追加
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import MapButton from "./MapButton"; 
import { mockCafeData, Cafe } from "../api/mockCafeData"; // 👈 Cafe 型を import

interface MapProps {
  cafes: Cafe[];
  onCafeIconClick: (cafe: Cafe) => void; // 👈 カフェ情報を渡すように変更
  setMapMode: (mode: "search" | "mycafe") => void; 
  selectedCafeId: number | null; 
  setSelectedCafeId: (id: number | null) => void; 
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

const Map: React.FC<MapProps> = ({ cafes, onCafeIconClick, setMapMode, selectedCafeId ,setSelectedCafeId }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="relative h-full w-full">
      {/* ボタン表示 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex space-x-4">
        <MapButton label="更新" onClick={() => setMapMode("search")} />
      </div>

      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
        >
          {cafes.map((cafe) => (
            <OverlayView
              key={cafe.id}
              position={{ lat: cafe.lat, lng: cafe.lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div
                onClick={() => {
                  onCafeIconClick(cafe);
                  setSelectedCafeId(cafe.id);
                }}
                className={`overflow-hidden cursor-pointer border-2 shadow-md
                  ${selectedCafeId === cafe.id 
                    ? "w-16 h-16 ring-4 ring-blue-500"
                    : "w-12 h-12 ring-2 ring-sky-300"}
                  rounded-full border-white
                `}
              >
                <img
                  src={cafe.photoUrls?.[0] || "/no-image.png"}
                  alt={cafe.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </OverlayView>
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
