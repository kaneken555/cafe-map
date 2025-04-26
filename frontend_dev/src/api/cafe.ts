// src/api/cafe.ts
import { Cafe, mockCafeData } from "./mockCafeData";


// ✅ mockData を参照するだけのメソッド
export const getCafeList = async (mapId: number): Promise<Cafe[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockCafeData[mapId] || []), 200);
    });
};

// 仮のPOSTリクエスト関数
export const addCafeToMyCafe = async (cafe: Cafe): Promise<void> => {
    // 本来は fetch/axios でPOSTする処理を書く
    console.log("📡 MyCafeに追加リクエスト:", cafe);
    alert("カフェがマイカフェに追加されました");
  
    // 例: await axios.post("/api/mycafe/", { ...cafe });
  };