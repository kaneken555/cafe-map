import React from "react";
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import MapButton from "./MapButton"; // 新規追加

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

// 仮のカフェ位置データ（バックエンドの代用）
const mockCafes = [
  {
    id: 1,
    name: "スタバ東京",
    lat: 35.681,
    lng: 139.765,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Starbucks_Coffee_restaurant.png",
  },
  {
    id: 2,
    name: "ドトール有楽町",
    lat: 35.675,
    lng: 139.760,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Doutor_Coffee_Senbayashi.jpg",
  },
];

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
          {mockCafes.map((cafe) => (
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
