// context/MapContext.tsx
import React, { createContext, useContext, useState, useMemo } from "react";
import { MapItem, SharedMapItem, MapMode } from "../types/map";
import { MAP_MODES } from "../constants/map";


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

export const MapProvider: React.FC<{
  children: React.ReactNode; 
  valueOverride?: Partial<MapContextProps>; // ✅ 追加
}> = ({ children, valueOverride }) => {
  const [mapList, setMapList] = useState<MapItem[]>(valueOverride?.mapList ?? []);
  const [selectedMap, setSelectedMap] = useState<MapItem | null>(valueOverride?.selectedMap ?? null);
  const [sharedMapList, setSharedMapList] = useState<SharedMapItem[]>(valueOverride?.sharedMapList ?? []);
  const [mapMode, setMapMode] = useState<MapMode>(valueOverride?.mapMode ?? MAP_MODES.search);

  const resetMapContext = valueOverride?.resetMapContext ?? (() => {
    setMapList([]);
    setSelectedMap(null);
    setSharedMapList([]);
    setMapMode(MAP_MODES.search); // 初期値にリセット
  });

  const value = useMemo(
    () => ({
      mapList,
      setMapList: valueOverride?.setMapList ?? setMapList,
      selectedMap,
      setSelectedMap: valueOverride?.setSelectedMap ?? setSelectedMap,
      sharedMapList,
      setSharedMapList: valueOverride?.setSharedMapList ?? setSharedMapList,
      mapMode,
      setMapMode: valueOverride?.setMapMode ?? setMapMode,
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
