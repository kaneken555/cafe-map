// src/api/cafe.ts
import { Cafe, mockCafeData } from "./mockCafeData";
import axios from "axios";
import { getCsrfToken } from "./auth";
import { toast } from "react-hot-toast";

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
      openTime: cafe.opening_hours,
      website: cafe.website,
      priceLevel: cafe.price_level,
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
  toast.success("カフェがマイカフェに追加されました");

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

export const searchCafe = async (lat: number, lng: number): Promise<Cafe[]> => {
  const csrfToken = await getCsrfToken(); // CSRF トークンを取得

  try {
    // 1. 検索APIからplace_id一覧を取得
    const baseRes = await axios.get(`http://localhost:8000/api/fetch-cafes/?lat=${lat}&lng=${lng}`, {
      headers: { "X-CSRFToken": csrfToken },
      withCredentials: true,
    });

    const baseCafes = baseRes.data.cafes;
    console.log("📡 カフェ一覧取得リクエスト:", baseCafes);


  // 2. 各place_idについて詳細情報取得
  const detailPromises = baseCafes.map(async (cafe: any, index: number) => {
    const detailRes = await axios.get(`http://localhost:8000/api/fetch-cafe-detail/?place_id=${cafe.place_id}`, {
      headers: { "X-CSRFToken": csrfToken },
      withCredentials: true,
    });

    const detail = detailRes.data;

    return {
      id: index + 1,
      placeId: detail.place_id,
      name: detail.name,
      address: detail.address,
      openTime: (detail.opening_hours ?? []).join(", "),
      status: detail.opening_hours?.length > 0 ? "現在営業中" : "営業時間外",
      distance: "", // ※後で中心からの距離計算で追加可
      price_day: "", // 任意
      price_night: "", // 任意
      priceLevel: detail.price_level ?? 0,
      rating: detail.rating ?? 0,
      userRatingTotal: detail.user_ratings_total ?? 0,
      photoUrls: detail.photos ?? [],
      phoneNumber: detail.phone_number ?? "",
      website: detail.website ?? "",
      lat: detail.latitude,
      lng: detail.longitude,
      businessStatus: detail.business_status ?? "",
    } as Cafe;
  });

  return await Promise.all(detailPromises);
} catch (error) {
  console.error("カフェ検索/詳細取得エラー:", error);
  return [];
}
};
