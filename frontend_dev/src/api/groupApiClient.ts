// src/api/groupApiClient.ts
import axios from "axios";
import { getCsrfToken } from "../services/authService";
import { API_BASE_PATH } from "../constants/api";
import { Group } from "../types/group";

export class GroupApiClient {
  /**
   * ログイン中のユーザーが所属するグループ一覧を取得
   */
  static async fetchGroupList(): Promise<Group[]> {
    const res = await axios.get(`${API_BASE_PATH}/groups/`, {
      withCredentials: true,
    });
    return res.data;
  }

  /**
   * 新しいグループを作成
   */
  static async createGroup(name: string, description = ""): Promise<Group> {
    const csrfToken = await getCsrfToken();

    const res = await axios.post(
      `${API_BASE_PATH}/groups/`,
      { name, description },
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );
    return res.data;
  }

  /**
   * 招待URL経由でグループに参加
   */
  static async joinGroup(groupUuid: string): Promise<void> {
    const csrfToken = await getCsrfToken();

    await axios.post(
      `${API_BASE_PATH}/groups/${groupUuid}/join/`,
      {},
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );
  }

  /**
   * 指定されたグループに属するマップ一覧を取得
   */
  static async fetchGroupMaps(groupUuid: number): Promise<{ id: number; name: string }[]> {
    const res = await axios.get(`${API_BASE_PATH}/groups/${groupUuid}/maps/`, {
      withCredentials: true,
    });
    return res.data;
  }
}
