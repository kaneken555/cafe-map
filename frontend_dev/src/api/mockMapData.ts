// src/api/mockMapData.ts

export interface MapItem {
    id: number;
    userId: number;    // 👈 追加
    name: string;
  }
  
// 仮のユーザーデータ
export const mockUsers = [
  { id: 1, name: "ゲストユーザー" },
  { id: 2, name: "テストユーザー" },
];

export const mockMapData: MapItem[] = [
    { id: 1, userId: 1, name: "渋谷カフェマップ" },
    { id: 2, userId: 1, name: "東京駅カフェマップ" },
    { id: 3, userId: 1 ,name: "京都カフェ巡り" },
    { id: 4, userId: 2, name: "大阪カフェ巡り" },
    { id: 5, userId: 2, name: "名古屋カフェ巡り" },
    { id: 6, userId: 2, name: "福岡カフェ巡り" },
];
  