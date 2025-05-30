// src/api/sharedMap.ts
import axios from "axios";
import { getCsrfToken } from "./auth";

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
      "http://localhost:8000/api/shared-maps/",
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
    const response = await axios.get("http://localhost:8000/api/shared-maps/check/", {
      params: { map_id: mapId },
      withCredentials: true,
    });

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
