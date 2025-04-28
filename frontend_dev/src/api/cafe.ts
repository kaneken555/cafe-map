// src/api/cafe.ts
import { Cafe, mockCafeData } from "./mockCafeData";
import axios from "axios";
import { getCsrfToken } from "./auth";

// ✅ mockData を参照するだけのメソッド
export const getCafeList = async (mapId: number): Promise<Cafe[]> => {

    const csrfToken = await getCsrfToken(); // CSRF トークンを取得
    try {
      const response = await axios.get(`http://localhost:8000/api/maps/${mapId}/`,
        { 
          headers: {
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true 
        } // クッキーを送信する
      );
      console.log("📡 カフェ一覧取得リクエスト:", response.data);
      console.log("📡 カフェ一覧取得リクエスト:", response.data.cafes);

      // ✅ cafesだけを取り出して、さらにフィールド名を変換して返す
      const cafes = response.data.cafes.map((cafe: any) => ({
        id: cafe.id,
        name: cafe.name,
        lat: cafe.latitude,        // latitude → lat
        lng: cafe.longitude,       // longitude → lng
        placeId: cafe.place_id,     // place_id → placeId
        photoUrls: cafe.photo_urls, // photo_urls → photoUrls
        address: cafe.address,
        rating: cafe.rating,
        phoneNumber: cafe.phone_number, // phone_number → phoneNumber
      }));

      return cafes;
    } catch (error) {
      console.error("addCafe エラー:", error);
      throw error;
    } 


    // フロントエンドのみの仮実装
    // return new Promise((resolve) => {
    //     setTimeout(() => resolve(mockCafeData[mapId] || []), 200);
    // });
};

// 仮のPOSTリクエスト関数
export const addCafeToMyCafe = async (mapId: number ,cafe: Cafe): Promise<void> => {
    // 本来は fetch/axios でPOSTする処理を書く
    console.log("📡 MyCafeに追加リクエスト:", cafe);
    alert("カフェがマイカフェに追加されました");
  
    // 例: await axios.post("/api/mycafe/", { ...cafe });
    const csrfToken = await getCsrfToken(); // CSRF トークンを取得

    try {
      console.log("addCafe", cafe);
      const response = await axios.post(`http://localhost:8000/api/maps/${mapId}/cafes/`, cafe,
      { 
          headers: {
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true 
        } // クッキーを送信する
  
      );
      return response.data;
    } catch (error) {
      console.error("addCafe エラー:", error);
      throw error;
    } 
 };