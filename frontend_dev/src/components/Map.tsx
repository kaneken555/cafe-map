import React from "react";
import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";

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
    photoUrl: "https://source.unsplash.com/80x80/?coffee",
  },
  {
    id: 2,
    name: "ドトール有楽町",
    lat: 35.675,
    lng: 139.760,
    photoUrl: "https://source.unsplash.com/81x81/?cafe",
  },
];

const Map: React.FC<MapProps> = ({ onCafeIconClick }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div className="relative h-full w-full">
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
                className="w-12 h-12 rounded-full border-4 border-white shadow-md ring-2 ring-sky-300 overflow-hidden cursor-pointer"
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
