import React from "react";
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import MapButton from "./MapButton"; // 新規追加
import { mockCafeData } from "../api/cafe.ts";

interface MapProps {
  onCafeIconClick: () => void;
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
const mapId = 1;
const cafes = mockCafeData[mapId] || [];

const Map: React.FC<MapProps> = ({ onCafeIconClick }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="relative h-full w-full">
      {/* ボタン表示 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex space-x-4">
        <MapButton label="更新" onClick={() => console.log("更新")} />
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
                onClick={onCafeIconClick}
                className="w-12 h-12 rounded-full border-2 border-white shadow-md ring-2 ring-sky-300 overflow-hidden cursor-pointer"
              >
                <img
                  src={cafe.photoUrl}
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
