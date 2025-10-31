// types/mapDisplay.ts
export type IconVariant = 'pin' | 'badge' | 'bubble' | 'photo';
export type MapStyleKey = "default" | "light" | "dark" | "mono";

export interface MapDisplayOptions {
  style: MapStyleKey;
  iconVariant: IconVariant;
  iconColor: string;
  iconSize: number; // ✅ 追加：px単位（例: 48）
  showLabels: boolean;
  layers: { traffic: boolean; transit: boolean; bicycling: boolean };
  clustering: boolean;
  heatmap: boolean;
}
