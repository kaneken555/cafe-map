import React, { useEffect, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { getGoogleMapsApiKey, fetchCafeLocations } from "../services/api";

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)",
};

const defaultCenter = {
  lat: 35.682839, // 東京の緯度
  lng: 139.759455, // 東京の経度
};

const MapComponent: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [cafes, setCafes] = useState<{ lat: number; lng: number; name: string }[]>([]);

  useEffect(() => {
    getGoogleMapsApiKey().then(setApiKey);
  }, []);

  useEffect(() => {
    if (apiKey) {
      fetchCafeLocations(defaultCenter.lat, defaultCenter.lng).then(setCafes);
    }
  }, [apiKey]);

  if (!apiKey) return <div>Loading...</div>;

  return (
    <APIProvider apiKey={apiKey}>
      <Map center={defaultCenter} zoom={14} style={containerStyle} >
      {cafes.map((cafe, index) => (
          <Marker key={index} position={{ lat: cafe.lat, lng: cafe.lng }} />
        ))}
      </Map>
    </APIProvider>
  );
};

export default MapComponent;
