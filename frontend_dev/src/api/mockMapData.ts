// src/api/mockMapData.ts

export interface MapItem {
    id: number;
    name: string;
  }
  
export const mockMapData: MapItem[] = [
    { id: 1, name: "渋谷カフェマップ" },
    { id: 2, name: "東京駅カフェマップ" },
    { id: 3, name: "京都カフェ巡り" },
];
  