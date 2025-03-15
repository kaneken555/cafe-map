import axios from "axios";

export const getGoogleMapsApiKey = async (): Promise<string> => {
  const response = await axios.get("http://localhost:8000/api/google-maps-key/");
  return response.data.apiKey;
};

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