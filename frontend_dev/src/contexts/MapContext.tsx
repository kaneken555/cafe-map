// context/MapContext.tsx
import React, { createContext, useContext, useState, useMemo } from "react";
import { MapItem, SharedMapItem, MapMode } from "../types/map";

interface MapContextProps {
  mapList: MapItem[];
  setMapList: React.Dispatch<React.SetStateAction<MapItem[]>>;
  selectedMap: MapItem | null;
  setSelectedMap: React.Dispatch<React.SetStateAction<MapItem | null>>;
  sharedMapList: SharedMapItem[];
  setSharedMapList: React.Dispatch<React.SetStateAction<SharedMapItem[]>>;
  mapMode: MapMode;
  setMapMode: React.Dispatch<React.SetStateAction<MapMode>>;
  resetMapContext: () => void;
}

const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mapList, setMapList] = useState<MapItem[]>([]);
  const [selectedMap, setSelectedMap] = useState<MapItem | null>(null);
  const [sharedMapList, setSharedMapList] = useState<SharedMapItem[]>([]);
  const [mapMode, setMapMode] = useState<MapMode>("search"); // 初期値を "mycafe" に設定

  const resetMapContext = () => {
    setMapList([]);
    setSelectedMap(null);
    setSharedMapList([]);
    setMapMode("search"); // 初期値にリセット
  };

  const value = useMemo(
    () => ({
      mapList,
      setMapList,
      selectedMap,
      setSelectedMap,
      sharedMapList,
      setSharedMapList,
      mapMode,
      setMapMode,
      resetMapContext,
    }),
    [mapList, selectedMap, sharedMapList, mapMode]
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within a MapProvider");
  return context;
};
