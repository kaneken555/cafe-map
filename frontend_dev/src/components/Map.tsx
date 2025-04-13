import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

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
  { id: 1, name: "スタバ東京", lat: 35.681, lng: 139.765 },
  { id: 2, name: "ドトール有楽町", lat: 35.675, lng: 139.760 },
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
            <Marker
              key={cafe.id}
              position={{ lat: cafe.lat, lng: cafe.lng }}
              title={cafe.name}
              onClick={onCafeIconClick}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
