// src/api/cafe.ts
import { Cafe } from "./mockCafeData";
import axios from "axios";
import { getCsrfToken } from "./auth";
import { toast } from "react-hot-toast";


const API_BASE = import.meta.env.VITE_API_URL;

// マップに登録されているカフェの情報を取得する
export const getCafeList = async (mapId: number): Promise<Cafe[]> => {
  const csrfToken = await getCsrfToken();
  try {
    const response = await axios.get(`${API_BASE}/maps/${mapId}/`,
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
      lat: cafe.latitude,           // latitude → lat
      lng: cafe.longitude,          // longitude → lng
      placeId: cafe.place_id,       // place_id → placeId
      photoUrls: cafe.photo_urls,   // photo_urls → photoUrls
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
};


// POSTリクエスト関数
export const addCafeToMyCafe = async (mapId: number ,cafe: Cafe): Promise<void> => {
  console.log("📡 MyCafeに追加リクエスト:", cafe);

  const csrfToken = await getCsrfToken();

  try {
    console.log("addCafe", cafe);
    const response = await axios.post(`${API_BASE}/maps/${mapId}/cafes/`, cafe,
    { 
      headers: {
        "X-CSRFToken": csrfToken,
      },
      withCredentials: true 
    } // クッキーを送信する

    );
    toast.success("カフェがマイカフェに追加されました");
    return response.data;
  } catch (error) {
    console.error("addCafe エラー:", error);
    throw error;
  } 
};


// 🔍 緯度・経度から周辺のカフェplace_idを取得し、詳細情報を取得して返す
export const searchCafe = async (lat: number, lng: number): Promise<Cafe[]> => {
  const csrfToken = await getCsrfToken();

  try {
    // 1. 検索APIからplace_id一覧を取得
    const baseRes = await axios.get(`${API_BASE}/fetch-cafes/?lat=${lat}&lng=${lng}`,
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );

    const baseCafes = baseRes.data.cafes;
    console.log("📡 カフェ一覧取得リクエスト:", baseCafes);
    // 2. 各place_idについて詳細情報取得
    const placeIds = baseCafes.map((cafe: any) => cafe.place_id);
    
    return await fetchCafeDetailsByPlaceIds(placeIds);

  } catch (error) {
    console.error("カフェ検索/詳細取得エラー:", error);
    return [];
  }
};


// 🔍 キーワード・緯度・経度から周辺のカフェplace_idを取得し、詳細情報を取得して返す
export const searchCafeByKeyword = async (
  keyword: string,
  lat: number,
  lng: number
): Promise<Cafe[]> => {
  const csrfToken = await getCsrfToken();

  try {
    // 1. 検索APIからplace_id一覧を取得
    const res = await axios.get(
      `${API_BASE}/fetch-cafes/keyword/?q=${encodeURIComponent(keyword)}&lat=${lat}&lng=${lng}`,
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );

    const baseCafes = res.data.cafes || [];
    console.log("📡 カフェ一覧取得リクエスト:", baseCafes);
    // 2. 各place_idについて詳細情報取得
    const placeIds = baseCafes.map((cafe: any) => cafe.place_id);

    return await fetchCafeDetailsByPlaceIds(placeIds);

  } catch (error) {
    console.error("キーワード検索エラー:", error);
    return [];
  }
};



/**
 * place_idリストから各カフェの詳細情報を取得してCafe型の配列で返す
 */
export const fetchCafeDetailsByPlaceIds = async (placeIds: string[]): Promise<Cafe[]> => {
  const csrfToken = await getCsrfToken();

  const detailPromises = placeIds.map(async (placeId, index) => {
    const detailRes = await axios.get(
      `${API_BASE}/fetch-cafe-detail/?place_id=${placeId}`,
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );

    const detail = detailRes.data;

    return {
      id: index + 1,
      placeId: detail.place_id,
      name: detail.name,
      address: detail.address,
      openTime: (detail.opening_hours ?? []).join(", "),
      status: detail.opening_hours?.length > 0 ? "現在営業中" : "営業時間外",
      distance: "",
      price_day: "",
      price_night: "",
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
};


export const searchSharedMap = async (groupUuid: string): Promise<Cafe[]> => {
  console.log("📡 グループマップ検索リクエスト(UUID):", groupUuid);

  const csrfToken = await getCsrfToken(); // CSRF トークンを取得
  try {
    const response = await axios.get(`${API_BASE}/shared_maps/${groupUuid}/`, 
      { 
        headers: {
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true ,
      }, // クッキーを送信する
    );
    console.log("📡 グループマップ検索リクエスト:", response.data);

    // ✅ cafesだけを取り出して、さらにフィールド名を変換して返す
    const cafes = response.data.cafes.map((cafe: any) => ({
      id: cafe.id,
      name: cafe.name,
      lat: cafe.latitude,           // latitude → lat
      lng: cafe.longitude,          // longitude → lng
      placeId: cafe.place_id,       // place_id → placeId
      photoUrls: cafe.photo_urls,   // photo_urls → photoUrls
      address: cafe.address,
      rating: cafe.rating,
      phoneNumber: cafe.phone_number, // phone_number → phoneNumber
      openTime: cafe.opening_hours,
      website: cafe.website,
      priceLevel: cafe.price_level,
    }));
    return cafes;
  } catch (error) {
    console.error("searchSharedMap エラー:", error);
    throw error;
  }
}


// シェアマップに登録されているカフェの情報を取得する
export const getSharedMapCafeList = async (mapUuid: string): Promise<Cafe[]> => {
  const csrfToken = await getCsrfToken();
  try {
    const response = await axios.get(`${API_BASE}/shared_maps/${mapUuid}/`,
      { 
        headers: {
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true 
      } // クッキーを送信する
    );
    console.log("📡 カフェ一覧取得リクエスト(シェアマップ):", response.data);
    console.log("📡 カフェ一覧取得リクエスト(シェアマップ):", response.data.cafes);

    // ✅ cafesだけを取り出して、さらにフィールド名を変換して返す
    const cafes = response.data.cafes.map((cafe: any) => ({
      id: cafe.id,
      name: cafe.name,
      lat: cafe.latitude,           // latitude → lat
      lng: cafe.longitude,          // longitude → lng
      placeId: cafe.place_id,       // place_id → placeId
      photoUrls: cafe.photo_urls,   // photo_urls → photoUrls
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
};
