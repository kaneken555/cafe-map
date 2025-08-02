// types/map.ts
export interface MapItem {
  id: number;
  name: string;
  description?: string;
}

export interface SharedMapItem {
  id: number;
  name: string;
  uuid: string;
}

export type MapMode = "search" | "mycafe" | "share"; // マップモードの型
