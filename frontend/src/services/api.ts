import axios from "axios";
import { CafeData } from "../types/cafe";
import { getCsrfToken } from "../api/auth";

// TODO:URLを変更する(環境変数を使う)

export const getGoogleMapsApiKey = async (): Promise<string> => {
  const response = await axios.get("http://localhost:8000/api/google-maps-key/");
  return response.data.apiKey;
};

// TODO: axios を使ってバックエンドからカフェの情報を取得する
export const fetchCafeLocations = async (lat: number, lng: number) => {
  const response = await fetch(`http://localhost:8000/api/cafes?lat=${lat}&lng=${lng}`);
  const data = await response.json();
  return data.cafes; // { lat: number, lng: number, name: string }[]
};

export const getCafePhotoUrl = async (photoReference: string) => {
  return `http://localhost:8000/api/get-cafe-photo?photo_reference=${photoReference}`;

};

// カフェの詳細情報をバックエンド経由で取得
export const fetchCafeDetailsFromBackend = async (placeId: string) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/cafe-detail/`, {
      params: { place_id: placeId }, // クエリパラメータとして送信
    });
    return response.data;
  } catch (error) {
    console.error("fetchCafeDetailsFromBackend エラー:", error);
    throw error;
  }
};

export const addCafe = async (mapId: number, cafe: CafeData) => {
  const csrfToken = await getCsrfToken(); // CSRF トークンを取得

  try {
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
}