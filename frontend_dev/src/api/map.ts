// src/api/map.ts
import axios from "axios";
import { getCsrfToken } from "./auth";


interface CreateMapRequest {
    name: string;
  }

interface CreateGroupMapRequest {
    name: string;
    groupUuid: string;
}

export const createMap = async (params: CreateMapRequest): Promise<void> => {
  console.log("📡 マップ作成リクエスト:", params.name);

  const csrfToken = await getCsrfToken(); // CSRF トークンを取得

  try {
      const response = await axios.post(`/api/maps/`, 
          { name: params.name }, 
          { 
              headers: {
              "X-CSRFToken": csrfToken,
              },
              withCredentials: true ,
          }, // クッキーを送信する
      );
      return response.data;
  } catch (error) {
      console.error("createMap エラー:", error);
      throw error;
  } 
}

export const createGroupMap = async (
    params: CreateGroupMapRequest
  ): Promise<void> => {
    console.log("📡 グループマップ作成リクエスト:", params);
  
    const csrfToken = await getCsrfToken();
  
    try {
      const response = await axios.post(
        `/api/groups/${params.groupUuid}/maps/`,
        { name: params.name },
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );
      console.log("✅ グループマップ作成成功:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ createGroupMap エラー:", error);
      throw error;
    }
  };


export const getMapList = async (): Promise<any> => {
  try {
      const response = await axios.get(`/api/maps/`, {
          withCredentials: true,
      }
    );
      console.log("📡 マップ一覧取得リクエスト:", response.data);
      return response.data;
  } catch (error) {
      console.error("getMapList エラー:", error);
      throw error;
  }
};

export const getGroupMapList = async (groupUuid: string): Promise<any> => {
  try {
    const response = await axios.get(`/api/groups/${groupUuid}/maps/`, 
      {
        withCredentials: true,
      }
    );
    console.log("📡 グループマップ一覧取得リクエスト:", response.data);
    return response.data;
  } catch (error) {
    console.error("getGroupMapList エラー:", error);
    throw error;
  }
};

export const getSharedMapList = async (): Promise<any> => {
  try {
      const response = await axios.get(`/api/shared_maps/`, 
        {
            withCredentials: true,
        }
      );
      console.log("📡 シェアマップ一覧取得リクエスト:", response.data);
      return response.data;
  } catch (error) {
      console.error("getSharedMapList エラー:", error);
      throw error;
  }
}

export const deleteMap = async (mapId: number): Promise<void> => {
  console.log("📡 マップ削除リクエスト:", mapId);

  const csrfToken = await getCsrfToken(); // CSRF トークンを取得

  try {
    const response = await axios.delete(`/api/maps/${mapId}/`, 
      { 
        headers: {
            "X-CSRFToken": csrfToken,
        },
        withCredentials: true ,
      }, // クッキーを送信する
    );
    return response.data;
  } catch (error) {
      console.error("deleteMap エラー:", error);
      throw error;
  } 
}

export const registerSharedMap = async (uuid: string): Promise<void> => {
  console.log("📡 シェアマップ登録リクエスト:", uuid);

  const csrfToken = await getCsrfToken(); // CSRF トークンを取得

  try {
    const response = await axios.post(
      `/api/shared-maps/${uuid}/register/`,
      {}, // ボディは空で送信
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("registerSharedMap エラー:", error);
    throw error;
  } 
}

export const copySharedMap = async (uuid: string, name: string): Promise<void> => {
  console.log("📡 シェアマップ複製リクエスト:", uuid, name);

  const csrfToken = await getCsrfToken();

  try {
    const response = await axios.post(
      `/api/shared-maps/${uuid}/copy/`,
      { name },
      {
        headers: {
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("copySharedMap エラー:", error);
    throw error;
  }
};
