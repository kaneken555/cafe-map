// type/group.ts
export interface Group {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  icon?: string; // 画像URL（省略可能）
}