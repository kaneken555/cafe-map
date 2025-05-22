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
        const response = await axios.post(`http://localhost:8000/api/maps/`, 
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
        `http://localhost:8000/api/groups/${params.groupUuid}/maps/`,
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
        const response = await axios.get(`http://localhost:8000/api/maps/`, {
            withCredentials: true,
        });
        console.log("📡 マップ一覧取得リクエスト:", response.data);
        return response.data;
    } catch (error) {
        console.error("getMapList エラー:", error);
        throw error;
    }
};

export const getGroupMapList = async (groupUuid: string): Promise<any> => {
    try {
      const response = await axios.get(`http://localhost:8000/api/groups/${groupUuid}/maps/`, {
        withCredentials: true,
      });
      console.log("📡 グループマップ一覧取得リクエスト:", response.data);
      return response.data;
    } catch (error) {
      console.error("getGroupMapList エラー:", error);
      throw error;
    }
};


export const deleteMap = async (mapId: number): Promise<void> => {
    console.log("📡 マップ削除リクエスト:", mapId);

    const csrfToken = await getCsrfToken(); // CSRF トークンを取得

    try {
        const response = await axios.delete(`http://localhost:8000/api/maps/${mapId}/`, 
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
