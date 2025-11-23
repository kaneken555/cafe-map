// src/api/customApiClient.ts
import axios from "axios";
import { getCsrfToken } from "../services/authService";
import { API_BASE_PATH } from "../constants/api";
import {
  Custom,
  CustomFormData,
  CustomListResponse,
} from "../types/custom";

export class CustomApiClient {
  /**
   * Custom一覧を取得
   * プリセットCustomと自分が作成したCustomを取得
   */
  static async getCustoms(): Promise<Custom[]> {
    const response = await axios.get<CustomListResponse>(
      `${API_BASE_PATH}/customs/`,
      { withCredentials: true }
    );
    return response.data.customs;
  }

  /**
   * Custom詳細を取得
   */
  static async getCustomById(id: number): Promise<Custom> {
    const response = await axios.get<Custom>(
      `${API_BASE_PATH}/customs/${id}/`,
      { withCredentials: true }
    );
    return response.data;
  }

  /**
   * 新しいCustomを作成
   */
  static async createCustom(data: CustomFormData): Promise<Custom> {
    const csrfToken = await getCsrfToken();
    const response = await axios.post<Custom>(
      `${API_BASE_PATH}/customs/`,
      data,
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );
    return response.data;
  }

  /**
   * Customを更新
   */
  static async updateCustom(
    id: number,
    data: Partial<CustomFormData>
  ): Promise<Custom> {
    const csrfToken = await getCsrfToken();
    const response = await axios.patch<Custom>(
      `${API_BASE_PATH}/customs/${id}/`,
      data,
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );
    return response.data;
  }

  /**
   * Customを削除
   */
  static async deleteCustom(id: number): Promise<void> {
    const csrfToken = await getCsrfToken();
    await axios.delete(`${API_BASE_PATH}/customs/${id}/`, {
      headers: { "X-CSRFToken": csrfToken },
      withCredentials: true,
    });
  }

  /**
   * MapにCustomを適用
   */
  static async applyCustomToMap(
    mapId: number,
    customId: number
  ): Promise<{ id: number; name: string; custom_id: number }> {
    const csrfToken = await getCsrfToken();
    const response = await axios.patch(
      `${API_BASE_PATH}/maps/${mapId}/custom/`,
      { custom_id: customId },
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );
    return response.data;
  }
}
