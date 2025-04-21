// src/api/cafe.ts
import { Cafe, mockCafeData } from "./mockCafeData";


// ✅ mockData を参照するだけのメソッド
export const getCafeList = async (mapId: number): Promise<Cafe[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockCafeData[mapId] || []), 200);
    });
};