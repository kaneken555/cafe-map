// constants/map.ts
import { MapMode } from "../types/map";

export const DEFAULT_CENTER = {
  lat: 35.681236,
  lng: 139.767125,
};

export const MAP_CONTAINER_STYLE = { 
  width: "100%", 
  height: "100%" 
};

export const MAP_MODES: { [key in MapMode]: MapMode } = {
  search: "search",
  mycafe: "mycafe",
  share: "share",
};
