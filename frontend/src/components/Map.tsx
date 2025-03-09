import React, { useEffect, useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { getGoogleMapsApiKey } from "../services/api";

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

  useEffect(() => {
    getGoogleMapsApiKey().then(setApiKey);
  }, []);

  if (!apiKey) return <div>Loading...</div>;

  return (
    <APIProvider apiKey={apiKey}>
      <Map center={defaultCenter} zoom={14} style={containerStyle} />
    </APIProvider>
  );
};

export default MapComponent;
