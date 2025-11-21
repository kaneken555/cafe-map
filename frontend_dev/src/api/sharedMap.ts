// src/api/sharedMap.ts
import axios from "axios";
import { getCsrfToken } from "../services/authService";
import { API_BASE_PATH } from "../constants/api";


interface CreateSharedMapRequest {
  mapId: number;
  title: string;
  description?: string;
}

interface CreateSharedMapResponse {
  share_uuid: string;
  title: string;
}

interface CheckSharedMapResponse {
  share_uuid: string;
  title: string;
}

export const createSharedMap = async (
  params: CreateSharedMapRequest
): Promise<CreateSharedMapResponse> => {
  console.log("📡 シェアマップ作成リクエスト:", params);

  const csrfToken = await getCsrfToken();

  try {
    const response = await axios.post(
      `${API_BASE_PATH}/shared-maps/`,
      {
        map_id: params.mapId,
        title: params.title,
        description: params.description || "",
      },
      {
        headers: {
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      }
    );

    console.log("✅ シェアマップ作成成功:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ createSharedMap エラー:", error);
    throw error;
  }
};



/**
 * 既にシェア済みのマップがあるか確認する
 * 存在すれば share_uuid を返す、存在しなければ null を返す
 */
export const checkSharedMap = async (
  mapId: number
): Promise<CheckSharedMapResponse | null> => {
  try {
    const response = await axios.get(`${API_BASE_PATH}/shared-maps/check/`,
      {
        params: { map_id: mapId },
        withCredentials: true,
      }
    );

    console.log("✅ シェアマップ確認成功:", response.data);

    if (response.data.shared === false) {
      return null; // 未作成
    }

    return {
      share_uuid: response.data.share_uuid,
      title: response.data.title,
    };
  } catch (error) {
    console.error("❌ checkSharedMap エラー:", error);
    throw error;
  }
};


interface PublicSharedMapDetailResponse {
  id: number;
  name: string;
  cafes: Array<{
    id: number;
    place_id: string;
    name: string;
    photo_urls: string[];
    rating: number;
    phone_number: string;
    address: string;
    opening_hours: string;
    website: string;
    latitude: number;
    longitude: number;
    price_level: number;
  }>;
}

/**
 * 公開シェアマップの詳細を取得（認証不要）
 */
export const getPublicSharedMapDetail = async (
  uuid: string,
  src?: string | null
): Promise<PublicSharedMapDetailResponse> => {
  console.log("📡 公開シェアマップ取得リクエスト:", uuid, "src:", src);

  try {
    const params = src ? { src } : {};
    const response = await axios.get(`${API_BASE_PATH}/shared-maps/${uuid}/`, {
      params,
    });

    console.log("✅ 公開シェアマップ取得成功:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ getPublicSharedMapDetail エラー:", error);
    throw error;
  }
};
