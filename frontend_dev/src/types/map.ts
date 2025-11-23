// types/map.ts
export interface MapItem {
  id: number;
  name: string;
  description?: string;
  custom_id?: number; // ✅ カスタマイズ設定ID
}

export interface SharedMapItem {
  id: number;
  name: string;
  uuid: string;
}

export type MapMode = "search" | "mycafe" | "share"; // マップモードの型
