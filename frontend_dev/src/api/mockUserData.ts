// src/api/mockUserData.ts

export interface User {
    id: number;
    name: string;
  }
  
export const mockUsers: User[] = [
  { id: 1, name: "ゲストユーザー" },
  { id: 2, name: "テストユーザー" },
];