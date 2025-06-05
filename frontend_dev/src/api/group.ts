// src/api/group.ts
import axios from "axios";
import { getCsrfToken } from "./auth";
import { toast } from "react-hot-toast";
import { Group } from "../types/group";



/**
 * ログイン中のユーザーが所属するグループ一覧を取得
 */
export const fetchGroupList = async (): Promise<Group[]> => {
  try {
    const res = await axios.get(`api/groups/`, 
      {
        withCredentials: true,
      }
    );
    console.log("📡 グループ一覧取得リクエスト:", res.data);
    return res.data;
  } catch (error) {
    console.error("fetchGroupList エラー:", error);
    throw error;
  }
};

/**
 * 新しいグループを作成
 */
export const createGroup = async (name: string, description = ""): Promise<Group> => {
  const csrfToken = await getCsrfToken();

  try {
    const res = await axios.post(
      `api/groups/`,
      { name, description },
      {
        headers: {
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      }
    );
    toast.success("グループを作成しました");
    console.log("📡 グループ作成リクエスト:", res.data);
    return res.data;
  } catch (error) {
    console.error("createGroup エラー:", error);
    toast.error("グループ作成に失敗しました");
    throw error;
  }
};

/**
 * 招待URL経由でグループに参加
 */
export const joinGroup = async (groupUuid: string): Promise<void> => {
  const csrfToken = await getCsrfToken();

  try {
    const res = await axios.post(
      `api/groups/${groupUuid}/join/`,
      {},
      {
        headers: {
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      }
    );
    toast.success("グループに参加しました");
    console.log("📡 グループ参加リクエスト:", res.data);
  } catch (error) {
    console.error("joinGroup エラー:", error);
    toast.error("グループ参加に失敗しました");
    throw error;
  }
};

/**
 * 指定されたグループに属するマップ一覧を取得
 */
export const fetchGroupMaps = async (groupUuid: number): Promise<{ id: number; name: string }[]> => {
  try {
    const res = await axios.get(`api/groups/${groupUuid}/maps/`, 
      {
        withCredentials: true,
      }
    );
    console.log("📡 グループマップ一覧取得リクエスト:", res.data);
    return res.data;
  } catch (error) {
    console.error("fetchGroupMaps エラー:", error);
    throw error;
  }
};
